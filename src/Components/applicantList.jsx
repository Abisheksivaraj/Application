import React, { useState } from "react";
import { IoIosPersonAdd, IoMdTrash, IoMdCloudUpload } from "react-icons/io";

const ApplicantList = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [selectedApplicantIndex, setSelectedApplicantIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleButtonClick = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleSaveClick = () => {
    if (applicantName.trim() !== "") {
      setApplicants([...applicants, { name: applicantName, documents: [] }]);
      setApplicantName("");
      setIsPopupOpen(false);
    }
  };

  const handleFileChange = (e) => {
    if (documentName.trim() !== "" && fileToUpload) {
      const updatedApplicants = [...applicants];
      const files = Array.from(e.target.files);
      updatedApplicants[selectedApplicantIndex].documents.push({
        documentName,
        files,
      });
      setApplicants(updatedApplicants);
      setDocumentName("");
      setFileToUpload(null);
    }
  };

  const handleCancelClick = () => {
    setIsPopupOpen(false);
    setApplicantName("");
  };

  const handleDeleteClick = (index) => {
    setApplicants(applicants.filter((_, i) => i !== index));
  };

  const handleUploadClick = (index) => {
    setSelectedApplicantIndex(index);
    setFileToUpload(true);
  };

  const indexOfLastApplicant = currentPage * itemsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - itemsPerPage;
  const currentApplicants = applicants.slice(
    indexOfFirstApplicant,
    indexOfLastApplicant
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(applicants.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-slate-200 h-screen p-5">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-[1.5rem] font-medium">Applicant Profiles</h1>
        <button
          onClick={handleButtonClick}
          className="flex items-center gap-1 bg-gray-500 p-3 w-[10rem] rounded-md text-[1rem] font-medium text-white"
        >
          <IoIosPersonAdd />
          Add Applicant
        </button>
      </div>

      <div className="flex justify-center">
        <hr className="bg-slate-400 mt-10 w-[90%] h-1" />
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentApplicants.map((applicant, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md relative"
          >
            <h2 className="text-xl font-medium mb-2">{applicant.name}</h2>

            {applicant.documents.length > 0 && (
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">
                      Document Name
                    </th>
                    <th className="border px-4 py-2 text-left">File</th>
                  </tr>
                </thead>
                <tbody>
                  {applicant.documents.map((doc, docIndex) => (
                    <tr key={docIndex}>
                      <td className="border px-4 py-2 text-green-500">
                        {doc.documentName}
                      </td>
                      <td className="border px-4 py-2">
                        {doc.files.map((file, fileIndex) => (
                          <a
                            key={fileIndex}
                            href={URL.createObjectURL(file)}
                            download={file.name}
                            className="text-blue-500"
                          >
                            {file.name}
                          </a>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {fileToUpload && selectedApplicantIndex === index && (
              <div className="mb-4">
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  placeholder="Enter document name"
                  className="border p-2 w-full rounded-md mb-2"
                />
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="border p-2 w-full rounded-md mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleFileChange}
                    className="bg-gray-500 p-2 rounded-md text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setFileToUpload(false)}
                    className="bg-red-500 p-2 rounded-md text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => handleUploadClick(index)}
              className="flex items-center gap-1 bg-blue-500 p-2 rounded-md text-white"
            >
              <IoMdCloudUpload />
              Upload Document
            </button>

            <button
              onClick={() => handleDeleteClick(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <IoMdTrash />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          className="bg-gray-500 p-2 rounded-md text-white"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg font-medium">
          Page {currentPage} of {Math.ceil(applicants.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          className="bg-gray-500 p-2 rounded-md text-white"
          disabled={currentPage === Math.ceil(applicants.length / itemsPerPage)}
        >
          Next
        </button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-xl font-medium mb-4">Add New Applicant</h2>
            <input
              type="text"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Enter applicant's name"
              className="border p-2 w-full rounded-md mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveClick}
                className="bg-gray-500 p-2 rounded-md text-white"
              >
                Save
              </button>
              <button
                onClick={handleCancelClick}
                className="bg-red-500 p-2 rounded-md text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantList;
