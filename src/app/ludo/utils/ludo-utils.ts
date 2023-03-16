import { fabric } from 'fabric'
export const HEIGHT: number = 525;
export const WIDTH: number = 525
export const BLOCK_SIZE: number = 35;
export const BOARD_HOUSE_COLORS = ['#c31307', '#00a300', '#ffc400', '#008cf8']
export const PAWNS_COUNT = 4
export const drawBoard = (canvas: fabric.Canvas): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fabric.loadSVGFromURL(`./../../../../assets/images/ludo/ludo-board.svg`, function (objects, options) {
      let loadedObjects = fabric.util.groupSVGElements(objects, options);
      loadedObjects.set({
        selectable: false,
        width: 1000,
        height: 1000,
        scaleX: 0.56,
        scaleY: 0.56,
        left: -17,
        top: -17
      })
      // loadedObjects.scaleToWidth(WIDTH);
      // loadedObjects.scaleToHeight(HEIGHT);
      canvas.add(loadedObjects)
      canvas.renderAll();
      resolve(true)
    })
  })
}

export const getOrientation = () => {
  return window.innerHeight > window.innerWidth ? 1 : 0
}

export const drawPawns = (canvas: fabric.Canvas, data: any): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (data) {
      data.forEach((d: any) => {
        if (d) {
          fabric.loadSVGFromString(PAWN_SVG_STRING, function (objects, options) {
            let loadedObjects = fabric.util.groupSVGElements(objects, options);
            loadedObjects.set({
              left: d?.initialPosition.x,
              top: d?.initialPosition.y,
              width: 40,
              height: 55,
              scaleX: 0.45,
              scaleY: 0.45,
              selectable: false,
              data: {
                id: d?.id,
                playerId: d?.playerId,
                name: 'pawn',
                initialPosition: d?.initialPosition,
                position: d?.position
              },
              fill: d?.color
            })
            objects.forEach((o: any) => {
              if (o.id === 'pawn') {
                o.set({
                  fill: d?.color
                })
              }
              if (o.id === 'highlighter') {
                o.data = {}
                o.set({
                  'strokeWidth': 0,
                  top: o.top! + 1.5,
                  left: o.left! + 1.5
                })
              }
            })
            canvas.add(loadedObjects)
            canvas.renderAll();
            resolve(true)
          })
        }
      })
      resolve(true)
    }
  })
}

export const getAllPawnsForPlayer = (canvas: fabric.Canvas, playerId: string) => {
  const pawns = canvas.getObjects().filter((object: fabric.Object) => object && object.data
      && object.data.name === 'pawn' && object.data.playerId === playerId)
  return pawns
}

export const getAllPawnsOnCanvas = (canvas: fabric.Canvas) => {
  const pawns = canvas.getObjects().filter((object: fabric.Object) => object && object.data && object.data.name === 'pawn')
  return pawns
}

export const getPawnForPlayer = (canvas: fabric.Canvas, id: string, playerId: string) => {
  return canvas.getObjects().find(o => o.data && o.data.id === id && o.data.playerId === playerId)
}

export const BOARD_SAFE_HOUSES = [
  [6, 13], [2, 8], [1, 6], [6, 2], [8, 1], [12, 6], [13, 8],[8, 12]
]

export const BOARD_PATHS: any = {
  1: [[2, 11], [3, 11], [3, 12], [2, 12], [6, 13], [6, 12], [6, 11], [6, 10], [6, 9], [5, 8],
  [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  [0, 7], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
  [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
  [7, 0], [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
  [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
  [14, 7], [14, 8], [13, 8], [12, 8], [11, 8], [10, 8], [9, 8],
  [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14],
  [7, 14], [7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]],

  2: [[2, 2], [3, 2], [2, 3],[3, 3], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
  [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
  [7, 0], [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
  [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
  [14, 7], [14, 8], [13, 8], [12, 8], [11, 8], [10, 8], [9, 8],
  [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14],
  [7, 14], [6, 14], [6, 13], [6, 12], [6, 11], [6, 10], [6, 9], [5, 8],
  [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],

  3: [[11, 2], [12, 2], [12, 3], [11, 3], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
  [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
  [14, 7], [14, 8], [13, 8], [12, 8], [11, 8], [10, 8], [9, 8],
  [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14],
  [7, 14], [6, 14], [6, 13], [6, 12], [6, 11], [6, 10], [6, 9], [5, 8],
  [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  [0, 7], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
  [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
  [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],

  4: [[12, 11], [11, 11], [11, 12], [12, 12], [13, 8], [12, 8], [11, 8], [10, 8], [9, 8],
  [8, 9], [8, 10], [8, 11], [8, 12], [8, 13], [8, 14],
  [7, 14], [6, 14], [6, 13], [6, 12], [6, 11], [6, 10], [6, 9], [5, 8],
  [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  [0, 7], [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6],
  [6, 5], [6, 4], [6, 3], [6, 2], [6, 1], [6, 0],
  [7, 0], [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
  [9, 6], [10, 6], [11, 6], [12, 6], [13, 6], [14, 6],
  [14, 7], [13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]]
}

export const PAWN_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="svg" version="1.1" width="60"
height="80" viewBox="0 0 800 1200">
<g id="layer1">
  <path id="highlighter" fill="#6f8a91"
    d="M 629.946 949.798 C 630.809 1079.158 416.819 1160.693 244.765 1096.568 C 164.127 1066.511 114.568 1010.424 115.074 949.798 C 114.213 820.44 328.205 738.899 500.258 803.03 C 580.894 833.088 630.454 889.174 629.946 949.798 Z"
    stroke="black" stroke-dasharray="50,50" stroke-dashoffset="0" stroke-width="50"
    transform="matrix(0.999996, 0.002941, -0.002941, 0.999996, 2.794966, -1.091444)"></path>
  <path id="highlighter-sec" fill="#6f8a91"
    d="M 541.57 950.327 C 542.14 1025.42 400.988 1072.753 287.498 1035.527 C 234.309 1018.078 201.619 985.52 201.953 950.327 C 201.384 875.231 342.536 827.897 456.026 865.124 C 509.216 882.574 541.906 915.133 541.57 950.327 Z"
    stroke="#741717" stroke-width="35"></path>
  <path id="path-1" fill="#b4b2b2" stroke="black" stroke-width="10"
    d="m373.3 58.058c-183.43 0.258-332.05 149.04-332.05 332.53 0 121.52 65.173 227.8 162.48 285.82 94.942 70.715 159.22 180.26 169.37 305.13l0.19675 0.33729 0.0843-0.14058 0.0562 0.14058 0.19675-0.33729c10.16-124.88 74.43-234.42 169.38-305.13 97.312-58.012 162.48-164.3 162.48-285.82 0-183.49-148.62-332.27-332.05-332.53-0.0469-0.000063-0.0937 0.000045-0.14053 0z" />
  <path id="path-2" stroke="black" stroke-width="20" fill="#dcd9d9"
    d="m467.14 220.93a145.71 145.71 0 1 1 -291.43 0 145.71 145.71 0 1 1 291.43 0z"
    transform="matrix(1.5292 0 0 1.5292 -118.15 51.446)" />
  <path id="pawn" fill="#ec0303" d="m467.14 220.93a145.71 145.71 0 1 1 -291.43 0 145.71 145.71 0 1 1 291.43 0z"
    transform="matrix(1.4997 0 0 1.4752 -108.69 55.502)" />
</g>
</svg>

`
export const BOARD_STATE = {
  INITIAL: 0,
  IN_PLAY: 1
}

