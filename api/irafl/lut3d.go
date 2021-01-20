package irafl

/*
#cgo CFLAGS: -I../../../../cxx/irafl/build/install/include
#include <stdlib.h>
#include <string.h>
#include <irafl_wrapper.h>
*/
import "C"

import (
    "strconv"
    "io/ioutil"
    "unsafe"

    "github.com/kataras/iris/v12"

    "gocv.io/x/gocv"
)

var Lut3DRoute string = "/irafl/lut3d"

var Lut3DFunc func(ctx iris.Context) = func(ctx iris.Context) {
    file, _, _ := ctx.FormFile("file")
    defer file.Close()
    filter, _, _ := ctx.FormFile("filter")
    defer filter.Close()
    size, _ := strconv.ParseInt(ctx.URLParams()["size"], 10, 32)
    streamSrc, _ := ioutil.ReadAll(file)
    img, _ := gocv.IMDecode(streamSrc, gocv.IMReadColor)
    if img.Channels() == 3 {
        gocv.CvtColor(img, &img, gocv.ColorBGRToBGRA)
    }
    streamFilter, _ := ioutil.ReadAll(filter)
    imgFilter, _ := gocv.IMDecode(streamFilter, gocv.IMReadColor)
    if imgFilter.Channels() == 3 {
        gocv.CvtColor(imgFilter, &imgFilter, gocv.ColorBGRToBGRA)
    }
    dataFilter := imgFilter.ToBytes()
    var param C.IRAFL_LUT3DIMAGE = C.IRAFL_LUT3DIMAGE {
        w: C.long(imgFilter.Cols()),
        h: C.long(imgFilter.Rows()),
        size: C.long(size),
    }
    param.data = (*C.uchar)(C.malloc(C.ulong(len(dataFilter))))
    C.memcpy(unsafe.Pointer(param.data), unsafe.Pointer(&dataFilter[0]), C.ulong(len(dataFilter)))
    data := img.ToBytes()
    res := make([]byte, img.Cols() * img.Rows() * 4)
    execute(res, data, img.Cols(), img.Rows(), 4, unsafe.Pointer(&param))
    out, _ := gocv.NewMatFromBytes(img.Rows(), img.Cols(), img.Type(), res)
    streamDst, _ := gocv.IMEncode(gocv.PNGFileExt, out)
    ctx.Binary(streamDst)
    C.free(unsafe.Pointer(param.data))
}
