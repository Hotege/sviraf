package irafl

import (
    "io/ioutil"
    "unsafe"

    "C"

    "github.com/kataras/iris/v12"

    "gocv.io/x/gocv"
)

var GrayRoute string = "/irafl/gray"

var GrayFunc func(ctx iris.Context) = func(ctx iris.Context) {
    file, _, _ := ctx.FormFile("file")
    defer file.Close()
    streamSrc, _ := ioutil.ReadAll(file)
    img, _ := gocv.IMDecode(streamSrc, gocv.IMReadColor)
    if img.Channels() == 3 {
        gocv.CvtColor(img, &img, gocv.ColorBGRToBGRA)
    }
    data := img.ToBytes()
    res := make([]byte, img.Cols() * img.Rows() * 4)
    empty := (*C.uchar)(nil)
    execute(res, data, img.Cols(), img.Rows(), 1, unsafe.Pointer(empty))
    out, _ := gocv.NewMatFromBytes(img.Rows(), img.Cols(), img.Type(), res)
    streamDst, _ := gocv.IMEncode(gocv.PNGFileExt, out)
    ctx.Binary(streamDst)
}
