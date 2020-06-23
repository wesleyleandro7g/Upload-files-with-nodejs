import React, { useState } from "react";
import Message from "./Message";
import ProgressBar from "./Progress";
import Axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState("Selecione o arquivo");
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await Axios.post("http://localhost:3333/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (ProgressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
            )
          );

          setTimeout(() => {
            setUploadPercentage(0);
            setMessage("");
            setUploadedFile({});
            setFileName("Selecione outro arquivo");
          }, 15000);
        },
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });
      setMessage("File Uploaded");
    } catch (err) {
      if (err.response.status === 500) {
        setMessage("There was problem with the server");
      } else {
        setMessage(err.response.data.msg);
      }
    }
  };

  return (
    <>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="custom-file">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {fileName}
          </label>
        </div>

        <ProgressBar percentage={uploadPercentage} />

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>

      {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center"> {uploadedFile.fileName} </h3>
            <img style={{ width: "100%" }} src={uploadedFile.filePath} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FileUpload;
