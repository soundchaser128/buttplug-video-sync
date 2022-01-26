import type {NextPage} from "next"
import Head from "next/head"
import React, {useEffect, useState} from "react"
import FileDrop from "../components/FileDrop"
import HapticCommandToButtplugMessage from "../lib/buttplug"
import {FunscriptCommand, LoadString} from "../lib/haptic-file"

type Mode = "uploading" | "watching"

interface Commands {
  commands: FunscriptCommand[]
  commandTimes: number[]
}

const Home: NextPage = () => {
  const [commands, setCommands] = useState<Commands | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [mode, setMode] = useState<Mode>("uploading")

  const onScriptUpload = async (file: File) => {
    const text = await file.text()
    const parsed = LoadString(text)
    // TODO error handling
    const commands = parsed!.Commands as FunscriptCommand[]
    const commandMap =
      HapticCommandToButtplugMessage.HapticCommandToButtplugMessage(commands)
    setCommands({
      commands,
      commandTimes: Array.from(commandMap.keys()),
    })
  }

  const onVideoUpload = (file: File) => {
    setVideoFile(file)
  }

  useEffect(() => {
    if (commands && videoFile) {
      setMode("watching")
    }
  }, [commands, videoFile])

  const onTimeUpdate: React.ReactEventHandler<HTMLVideoElement> = (e) => {
    const time = Math.floor(e.currentTarget.currentTime * 1000)
  }

  return (
    <div className="grid place-content-center h-screen">
      <Head>
        <title>Buttplug Video Sync</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {mode === "uploading" && (
        <>
          <FileDrop onUpload={onScriptUpload} disabled={Boolean(commands)}>
            {commands ? "Done." : "Drag and drop your Funscript file here."}
          </FileDrop>

          <FileDrop onUpload={onVideoUpload} disabled={Boolean(videoFile)}>
            {videoFile ? "Done." : "Drag and drop your video file here."}
          </FileDrop>
        </>
      )}

      {mode === "watching" && (
        <>
          <video
            controls
            src={URL.createObjectURL(videoFile!)}
            onTimeUpdate={onTimeUpdate}
          />
        </>
      )}
    </div>
  )
}

export default Home
