import {useCallback} from "react"
import {useDropzone} from "react-dropzone"
import {UploadIcon} from "@heroicons/react/solid"

interface Props {
  onUpload: (file: File) => void
  disabled?: boolean
}

const styles = {
  base: "p-8 shadow-lg text-lg text-center flex items-center text-black border rounded-xl",
  disabled: "opacity-50",
}

type Styles = Record<string, string | string[]>

export function pickStyles(
  stylesObject: Styles,
  properties: (keyof Styles | undefined | null | false | string)[]
): string {
  const styles = properties.flatMap((key) => {
    if (key) {
      return stylesObject[key]
    } else {
      return []
    }
  })

  return styles.join(" ")
}

const FileDrop: React.FC<Props> = ({onUpload, children, disabled}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const files = acceptedFiles as FileList

      if (files.length > 0) {
        onUpload(files[0])
      }
    },
    [onUpload]
  )
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div
      className={pickStyles(styles, [
        "base",
        disabled && "disabled",
        "min-width[400px]",
      ])}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <UploadIcon className="h-32 w-32" />
      {children}
    </div>
  )
}

export default FileDrop
