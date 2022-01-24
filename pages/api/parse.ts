import {LoadString} from "haptic-movie-file-reader"
import {NextApiRequest, NextApiResponse} from "next"
import multer from "multer"
import nc from "next-connect"
import {Readable} from "stream"
import fs from "fs/promises"

export const config = {
  api: {
    bodyParser: false,
  },
}

interface RequestExt extends NextApiRequest {
  file: {
    fieldname: string
    originalname: string
    encoding: string
    mimetype: string
    size: number
    stream: Readable
    destination: string
    filename: string
    path: string
    buffer: Buffer
  }
}

const upload = multer({
  storage: multer.diskStorage({}),
})

const apiRoute = nc<RequestExt, NextApiResponse>({
  onError(error, req, res) {
    res.status(500).json({error: `error: ${error.message}`})
  },
  onNoMatch(req, res) {
    res.status(405).json({error: `Method '${req.method}' Not Allowed`})
  },
})

apiRoute.use(upload.single("file"))

apiRoute.post(async (req, res) => {
  const file = await fs.readFile(req.file.path, "utf-8")
  const parsedFile = LoadString(file)
  res.status(200).json(parsedFile)
})

export default apiRoute
