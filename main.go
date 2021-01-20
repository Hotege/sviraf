package main

/*
#cgo CFLAGS: -I../../cxx/irafl/build/install/include
#cgo LDFLAGS: -L../../cxx/irafl/build/install/lib -lirafl
#include <irafl_wrapper.h>
*/
import "C"

import (
    //"unsafe"

    "github.com/kataras/iris/v12"
    "github.com/kataras/iris/v12/middleware/logger"
    "github.com/kataras/iris/v12/middleware/recover"

    //"gocv.io/x/gocv"

    "sviraf/api"
)

func main() {
    C.IRAFL_Initialize()

    /*img := gocv.IMRead("/root/hs.png", gocv.IMReadColor)
    if img.Channels() == 3 {
        gocv.CvtColor(img, &img, gocv.ColorBGRToBGRA)
    }
    fmt.Println(img.Cols())
    fmt.Println(img.Rows())
    data := img.ToBytes()
    fmt.Println(data[0:4])
    src := (*C.uchar)(unsafe.Pointer(&data[0]))
    res := make([]byte, img.Cols() * img.Rows() * 4)
    dst := (*C.uchar)(unsafe.Pointer(&res[0]))
    empty := (*C.uchar)(nil) //unsafe.Pointer(nil)
    C.IRAFL_Execute(dst, src, C.long(img.Cols()), C.long(img.Rows()), C.uint(1), unsafe.Pointer(empty))
    out, _ := gocv.NewMatFromBytes(img.Rows(), img.Cols(), img.Type(), res)
    gocv.CvtColor(out, &out, gocv.ColorBGRAToBGR)
    gocv.IMWrite("out.png", out)*/

    app := iris.New()
    app.Use(recover.New())
    app.Use(logger.New())
    app.PartyFunc(api.APIRoute, api.APIGroup)
    app.Run(iris.Addr(":62934"))
    C.IRAFL_Terminate()
}
