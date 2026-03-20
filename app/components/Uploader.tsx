import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import uploadIcon from "../assets/icons/upload2.png";
import pdfIcon from "../images/pdf.png";

interface FileUploaderProps {
    onFileSelected: (file: File | null) => void;
}

const Style = {
    fontSize: "0.875rem",
    color: "#6B7280",
    fontWeight: "400",
    border: "1px solid #E5E7EB",
    borderRadius: "0.375rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ffffffb5",
}
const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    const units = ["KB", "MB", "GB", "TB"];
    let size = bytes / 1024;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
};


const FileUploader = ({ onFileSelected }: FileUploaderProps) => {

    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0] ?? null;
        onFileSelected(selectedFile);
        setFile(selectedFile);
    }, [onFileSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 500 * 1024 * 1024,
    });

    return (
        <>
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
            <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
         {!file &&(
            <div className="mx-auto w-16 h-16">
            <img src={uploadIcon} alt="Upload" className="w-auto h-auto" />
        </div>
         )}

        {file ? (
           <div className="uploader-selected-file" onClick={(e) => {
            e.preventDefault();
            setFile(null);
            onFileSelected(null);
           }}>
             <div className="flex items-center space-x-4">
                <img src={pdfIcon} alt="PDF Icon" className="size-10" />
                <div>
                   <p className="text-lg text-gray-500 truncate max-w-xs hover:max-w-full transition-all ease-in-out duration-300">
                    <span className="font-semibold">{file.name}</span>
                    </p>
                    <p className="text-lg text-gray-500">{formatSize(file.size)}</p>
                </div>
                
            </div>
            <button onClick={(e) =>{
                    setFile(null)
                    e.preventDefault();
                    onFileSelected(null);
                }} className="flex items-center justify-center gap-2 " style={Style}>Remove Pdf</button>
           </div>
        ) : (
            <div>
                <p className="text-lg text-gray-500">
                    <span className="font-semibold" >
                        {isDragActive ? "Drop your file here" : "Drag & drop your file here, or click to select one"}
                    </span>
                </p>
                <p className="text-lg text-gray-500">pdf (500kb max)</p>
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