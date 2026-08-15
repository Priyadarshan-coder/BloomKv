package bloom

import (
	"hash/crc64"
	"hash/fnv"
	"sync"

	"github.com/spaolacci/murmur3"
)

// Filter holds our data and a mutex for concurrent memory access.
type Filter struct {
	data []uint64
	size uint64
	mu   sync.RWMutex
}

// New initializes the bit array.
func New(numUint64s uint64) *Filter {
	return &Filter{
		data: make([]uint64, numUint64s),
		size: numUint64s * 64,
	}
}

// hashPositions calculates 3 distinct bit positions using FNV, Murmur3, and CRC64.
func (f *Filter) hashPositions(item string) [3]uint64 {
	data := []byte(item)
	var positions [3]uint64

	hFnv := fnv.New64a()
	hFnv.Write(data)
	positions[0] = hFnv.Sum64() % f.size

	hMurmur := murmur3.New64()
	hMurmur.Write(data)
	positions[1] = hMurmur.Sum64() % f.size

	hCrc := crc64.New(crc64.MakeTable(crc64.ECMA))
	hCrc.Write(data)
	positions[2] = hCrc.Sum64() % f.size

	return positions
}

// Add safely sets all 3 calculated bits to 1.
func (f *Filter) Add(item string) {
	positions := f.hashPositions(item)

	f.mu.Lock()
	defer f.mu.Unlock()

	for _, pos := range positions {
		index := pos / 64
		offset := pos % 64
		f.data[index] |= (1 << offset)
	}
}

// Check safely verifies if all 3 calculated bits are 1.
func (f *Filter) Check(item string) bool {
	positions := f.hashPositions(item)

	f.mu.RLock()
	defer f.mu.RUnlock()

	for _, pos := range positions {
		index := pos / 64
		offset := pos % 64

		if (f.data[index] & (1 << offset)) == 0 {
			return false
		}
	}

	return true
}
