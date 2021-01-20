package irafl

/*
#cgo CFLAGS: -I../../../../cxx/irafl/build/install/include
#cgo LDFLAGS: -L../../../../cxx/irafl/build/install/lib -lirafl
#include <irafl_wrapper.h>
*/
import "C"

import (
    "unsafe"
)

func execute(dstPixels []byte, srcPixels []byte, w int, h int, id int, param unsafe.Pointer) {
    src := (*C.uchar)(unsafe.Pointer(&srcPixels[0]))
    dst := (*C.uchar)(unsafe.Pointer(&dstPixels[0]))
    C.IRAFL_Execute(dst, src, C.long(w), C.long(h), C.uint(id), param)
}
