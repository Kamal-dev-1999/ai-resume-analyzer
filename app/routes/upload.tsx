import { type FormEvent, useState } from "react";
import bgMain from "~/images/bg-main.svg";
import resumeScanGif from "~/images/resume-scan.gif";
import NavBar  from "~/components/Nav-bar";
import FileUploader from "~/components/Uploader"
import  {usePuterStore } from "~/lib/puter";
import { convertPdfToImage } from "~/lib/pdf2img";
import { prepareInstructions } from "../../constants/index";

const Upload =() => {
    // here we are using the puter store to get the auth state, loading state, fs, ai and kv instances. We will use these to upload the file, analyze it and store the results.
    // ai - to call the ai functions
    // fs - to upload the file and get the url
    // kv - to store the results of the analysis
    const {auth,isLoading,fs,ai,kv} = usePuterStore();
    const [isProcessing,setProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelected = (file: File | null) => {
        setFile(file);
    }


    const handleAnalyze = async ({companyName, jobTitle, jobDescription, file} : {companyName: string, jobTitle: string, jobDescription: string, file: File}) => {
        setProcessing(true);
        try {
            setStatusText("Analyzing your resume...");

            const uploadedFile = await fs.upload([file]);
            if(!uploadedFile) {
                alert("Failed to upload the file. Please try again.");
                return;
            }

            setStatusText("Generating feedback...");
            const imageResult = await convertPdfToImage(file);
            if (!imageResult.file) {
                alert(imageResult.error || "Failed to convert pdf to image. Please try again.");
                return;
            }

            setStatusText("Uploading image...");
            const uploadedImage = await fs.upload([imageResult.file]);
            if(!uploadedImage) {
                alert("Failed to upload the image. Please try again.");
                return;
            }

            setStatusText("Preparing Data...");

            const uuid = crypto.randomUUID();
            console.log({ companyName, jobTitle, jobDescription, uuid, uploadedFile, uploadedImage });

            const data ={
                id: uuid,
                resumePath: uploadedFile.path,
                resumeImagePath: uploadedImage.path,
                companyName: companyName,
                jobTitle: jobTitle,
                jobDescription: jobDescription,
                feedback: ""
            }
            await kv.set(`resume-analysis-${uuid}`, JSON.stringify(data));
            setStatusText("Analyzing with AI...")
            
            const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({jobTitle, jobDescription})
            ); 
            console.log({feedback});
            if (!feedback) {
                return setStatusText("Failed to get feedback from AI. Please try again.");      
            } 

            const feedbackData = typeof feedback.message.content === "string" ? feedback.message.content : feedback.message.content[0];

            data.feedback = JSON.stringify(feedbackData);
            await kv.set(`resume-analysis-${uuid}`, JSON.stringify(data));
            setStatusText("Analysis complete! You can view your feedback in the history section.");
            console.log("Final data stored in KV:", data);

        } catch (error) {
            console.error(error);
            alert("Something went wrong while analyzing your resume. Please try again.");
        } finally {
            setProcessing(false);
        }
    }


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        // prevent reload of the screen
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-name") as string;
        const jobDescription = formData.get("job-description") as string;
        const resume = file;

        if (!resume) {
            alert("Please upload a resume before submitting.");
            return;
        }

        void handleAnalyze({companyName, jobTitle, jobDescription, file: resume});

        // console.log({ companyName, jobTitle, jobDescription, file });
    };  


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