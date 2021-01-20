package irafl

/*
#cgo CFLAGS: -I../../../../cxx/irafl/build/install/include
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

var VoronoiRoute string = "/irafl/voronoi"

var VoronoiFunc func(ctx iris.Context) = func(ctx iris.Context) {
    file, _, _ := ctx.FormFile("file")
    defer file.Close()
    radius, _ := strconv.ParseFloat(ctx.URLParams()["r"], 64)
    k, _ := strconv.ParseInt(ctx.URLParams()["k"], 10, 32)
    var param C.IRAFL_VP = C.IRAFL_VP {
        r: C.double(radius),
        k: C.uint(k),
    }
    streamSrc, _ := ioutil.ReadAll(file)
    img, _ := gocv.IMDecode(streamSrc, gocv.IMReadColor)
    if img.Channels() == 3 {
        gocv.CvtColor(img, &img, gocv.ColorBGRToBGRA)
    }
    data := img.ToBytes()
    res := make([]byte, img.Cols() * img.Rows() * 4)
    execute(res, data, img.Cols(), img.Rows(), 8, unsafe.Pointer(&param))
    out, _ := gocv.NewMatFromBytes(img.Rows(), img.Cols(), img.Type(), res)
    streamDst, _ := gocv.IMEncode(gocv.PNGFileExt, out)
    ctx.Binary(streamDst)
}
