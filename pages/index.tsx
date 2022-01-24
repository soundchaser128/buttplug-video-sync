import type {NextPage} from "next"
import Head from "next/head"
import React, {useEffect, useState} from "react"
import FileDrop from "../components/FileDrop"

async function parseScript(file: File) {
  const body = new FormData()
  body.append("file", file)
  const response = await fetch("/api/parse", {method: "POST", body})
  return await response.json()
}

type Mode = "uploading" | "watching"

const Home: NextPage = () => {
  const [parsedScript, setParsedScript] = useState()
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [mode, setMode] = useState<Mode>("uploading")

  const onScriptUpload = async (file: File) => {
    const parsed = await parseScript(file)
    setParsedScript(parsed)
  }

  const onVideoUpload = (file: File) => {
    setVideoFile(file)
  }

  useEffect(() => {
    if (parsedScript && videoFile) {
      setMode("watching")
    }
  }, [parsedScript, videoFile])

  return (
    <div className="grid place-content-center h-screen">
      <Head>
        <title>Buttplug Video Sync</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {mode === "uploading" && (
        <>
          <FileDrop onUpload={onScriptUpload} disabled={Boolean(parsedScript)}>
            {parsedScript ? "Done." : "Drag and drop your Funscript file here."}
          </FileDrop>

          <FileDrop onUpload={onVideoUpload} disabled={Boolean(videoFile)}>
            {videoFile ? "Done." : "Drag and drop your video file here."}
          </FileDrop>
        </>
      )}

      {mode === "watching" && (
        <>
          <video controls src={URL.createObjectURL(videoFile!)} />
        </>
      )}
    </div>
  )
}

export default Home
