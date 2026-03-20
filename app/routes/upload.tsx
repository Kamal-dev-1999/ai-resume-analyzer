import { type FormEvent, useState } from "react";
import bgMain from "~/images/bg-main.svg";
import resumeScanGif from "~/images/resume-scan.gif";
import NavBar  from "~/components/Nav-bar";
import FileUploader from "~/components/Uploader"

const Upload =() => {

    const [isProcessing] = useState(false);
    const [statusText] = useState("");
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelected = (file: File | null) => {
        setFile(file);
    }


    return (
    <main
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundImage: `url(${bgMain})` }}>
        <NavBar />
    <section className="main-section">
        <div className="page-heading">
            <h1>Smart feedback for your Dream Job</h1>
            {isProcessing ? (
                <>
                <h2>{statusText}</h2>
                <img src={resumeScanGif} alt="Resume scan animation" className="w-full" />
                </>
            ) : (
                <>
                <h2>Upload your resume</h2>
                </>
            )}{
                !isProcessing && (
                    <form action="" id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                        <div className="form-div">
                            <label htmlFor="company-name">Company Name</label>
                            <input type="text" name="company-name" id="company-name" placeholder="Enter company name" required/>

                        </div>
                         <div className="form-div">
                            <label htmlFor="job-name">Job Title</label>
                            <input type="text" name="job-name" id="job-name" placeholder="Enter job title" required/>

                        </div>
                         <div className="form-div">
                            <label htmlFor="job-description">Job Description</label>
                            <textarea name="job-description" id="job-description" placeholder="Enter job description " rows={5} required/>
                        </div>
                         <div className="form-div">
                            <label htmlFor="uploader">Upload resume</label>
                            <FileUploader onFileSelected={handleFileSelected} />
                        </div>
                        <button type="submit" className="primary-button" disabled={!file}>Analyze Resume</button>
                    </form>
                )
            }
        </div>

    </section>

    </main>
    )
}
export default Upload;