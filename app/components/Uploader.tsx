import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import uploadIcon from "../assets/icons/upload.png";

function FileUploader(){
    const [file, setFile] = useState<File | null>(null);
     const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <>
        <div className="w-full gradient-border">
             <div {...getRootProps()}>
      <input {...getInputProps()} />
     <div className="space-y-4 cursor-pointer">
        <div className="mx-auto w-16 h-16">
            <img src={uploadIcon} alt="Upload" className="size-20" />
        </div>

        {file ? (
            <div>

            </div>
        ) : (
            <div>

            </div>
        )
    }
     </div>
    </div>
        </div>
        </>
    )
}
export default FileUploader;