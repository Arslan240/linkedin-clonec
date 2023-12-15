import ReactDom from 'react-dom'
import { useState, useEffect } from 'react'
import "./PostModal.css"
import { ProfileIcon } from '../../../../components/index.js'
import { MEDIA_TYPE_NONE, MEDIA_TYPE_DOC, MEDIA_TYPE_VIDEO, MEDIA_TYPE_IMAGES } from '../../../../firebase/firebase-config.js'
import { IoCloseOutline } from 'react-icons/io5'
import { addNewMediaPost, addNewTextPost, addPostIdToUser } from '../../../../firebase/utils/index.js'
import { SpinnerCircularFixed } from "spinners-react";
import { BsCameraVideoFill } from 'react-icons/bs'
import { BiImage } from 'react-icons/bi'
// import { FaPollH } from 'react-icons/fa'
import { GrDocumentText } from 'react-icons/gr'

import { useAuth } from '../../../../Context/AuthContext.jsx'
import { capitalize } from '../../../../utils/index.js'



// type ModalProps = {
//   open: boolean,
//   onClose: () => void,
//   setPostAdded: (boolean) => void,
// }
const icon_size = 30;
const icon_size_small = 20;
const cloudinary_name = "dc9a5xscc"
const cloudinary_preset = "linkedin_preset"
const one_mb = 1000000
const five_mb = 5000000
const twenty_mb = 20000000

export default function Modal({ open, onClose, setPostAdded }) {
  if (!open) return null

  const { userData } = useAuth()
  const { firstName, lastName } = userData;

  const [postDesc, setPostDesc] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [showAddModal, setShowModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState("");
  const [mediaType, setMediaType] = useState < String > ("none");
  const [fileUploadError, setFileUploadError] = useState("");
  const [_showError, setShowError] = useState(false);
  const [_isFileUploadedToCloud, setIsFileUploadedToCloud] = useState(false);

  const handleAddPost = async () => {

    try {
      setIsAdding(true)
      let postID;

      if (mediaType === MEDIA_TYPE_NONE) {
        postID = await addNewTextPost(postDesc);
      } else {
        postID = await addNewMediaPost({ postDesc, mediaURL: uploadedFileUrl, mediaType })
      }
      await addPostIdToUser(postID);
      setIsAdding(false)
      onClose()

      // @ts-ignore
      setPostAdded(prev => !prev); //to rerender feed
    } catch (error) {
    }
  }

  const handleMediaType = async (event, type) => {
    // if file is already uploaded and then we try to change it an error will be thrown.
    if (uploadedFileUrl && type === MEDIA_TYPE_NONE) {
      return event;
    }
    if (uploadedFileUrl) {
      setFileUploadError("A file is already uploaded to server. Just for experimental purposes because limited credits available at cloudinary")
    }
    setMediaType(type);
    // setShowModal(true);
  }

  function createErrorTimeout() {
    setShowError(true);
    return setTimeout(() => setShowError(false), 500)
  }

  useEffect(() => {
    // let errorTimeout;
    async function uploadFile() {
      if (uploadedFile) {

        const fd = new FormData();
        fd.append('file', uploadedFile.file);
        fd.append('upload_preset', cloudinary_preset);
        fd.append('cloud_name', cloudinary_name);

        try {
          setIsUploading(true);
          const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary_name}/auto/upload/`, {
            method: "POST",
            body: fd,
          })
          const uploadedData = await response.json();
          setIsUploading(false)
          setIsFileUploadedToCloud(true);
          setUploadedFile(null)
          setUploadedFileUrl(uploadedData.secure_url);
        } catch (error) {
          setFileUploadError(error.message)
        }
      }
    }

    uploadFile();

  }, [uploadedFile])

  useEffect(() => {
    const errorTimeout = createErrorTimeout();

    return (() => {
      clearTimeout(errorTimeout);
    })
  }, [fileUploadError])

  const handleFileUpload = async (event) => {
    const { files } = event?.target;

    if (mediaType === MEDIA_TYPE_IMAGES && files[0].size > one_mb) {
      setFileUploadError("File must be less than 1mb")
      setMediaType(MEDIA_TYPE_NONE)
      return;
    }
    if (mediaType === MEDIA_TYPE_DOC && files[0].size > five_mb) {
      setFileUploadError("File must be less than 5mb");
      setMediaType(MEDIA_TYPE_NONE)
      return;
    }
    if (mediaType === MEDIA_TYPE_DOC && files[0].type !== "application/pdf") {
      setFileUploadError("File type must be only pdf")
      setMediaType(MEDIA_TYPE_NONE)
      return;
    }
    if (mediaType === MEDIA_TYPE_VIDEO && files[0].size > twenty_mb) {
      setFileUploadError("File must be less than 20mb");
      setMediaType(MEDIA_TYPE_NONE)
      return;
    }



    setUploadedFile({ file: files[0], url: URL.createObjectURL(files[0]) });
    // event?.target.value = "";
  }

  const submitFiles = async () => {
    setShowModal(false);
  }




  return ReactDom.createPortal(
    <>
      <div className='post__overlay' />
      <div className='post__modal'>

        {!showAddModal ? (
          <>
            <div className="post__modal__topContainer">
              <div className="post__modal__profileContainer">
                {/* TODO: Populate with relevant information */}
                <div className="post__modal__profileLeft">
                  <ProfileIcon height={50} name={`${firstName} ${lastName}`} />
                  <div>
                    <span className='post__modal__profileName'>{`${capitalize(firstName)} ${capitalize(lastName)}`}</span>
                  </div>
                </div>
                <IoCloseOutline className="close__icon icon" size={icon_size} onClick={onClose} />
              </div>
              <div className="postModal__textContainer">
                <textarea
                  className='postModal__textarea'
                  placeholder='What do you want to talk about?'
                  value={postDesc}
                  onChange={(e) => setPostDesc(e.target.value)}
                />
              </div>
              <div className="post__document__view">

                {isUploading ? (
                  <SpinnerCircularFixed color='var(--linkedin-blue)' />
                ) : (
                  mediaType === MEDIA_TYPE_IMAGES ? (
                    <img className='post__image__view' src={uploadedFileUrl} alt="Uploaded Image" />
                  ) : mediaType === MEDIA_TYPE_DOC ? (
                    // TODO: PDF not shown properly work on it.
                    <iframe
                      title="Document Viewer"
                      src={uploadedFileUrl}
                      width="70%"
                      height="250"
                    />
                  ) : mediaType === MEDIA_TYPE_VIDEO && uploadedFileUrl ? (
                    <video controls width="100%" height="300">
                      <source src={uploadedFileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <></>
                  )
                )}
                {/* {mediaType !== MEDIA_TYPE_NONE && <iframe src={uploadedFileUrl}/>} */}

              </div>
              <div className="post__errors">
                <span className="post__error error">{fileUploadError}</span>
              </div>
              <div className="postModal__icons">
                <div className="icon__container">
                  <input type="file" id="image__input" onChange={handleFileUpload} />
                  <label className={uploadedFileUrl ? 'disabled' : ''} htmlFor={uploadedFileUrl ? '' : "image__input"} onClick={(e) => handleMediaType(e, MEDIA_TYPE_IMAGES)}><BiImage size={icon_size_small} color="#454545" /></label>
                </div>
                <div className="icon__container">
                  <input type="file" id="video__input" onChange={handleFileUpload} />
                  <label className={uploadedFileUrl ? 'disabled' : ''} htmlFor={uploadedFileUrl ? '' : "video__input"} onClick={(e) => handleMediaType(e, MEDIA_TYPE_VIDEO)}><BsCameraVideoFill size={icon_size_small} color="#454545" /></label>
                </div>
                {/* BECUASE You can't upload a pdf file to cloudinary in free system */}
                <div className="icon__container">
                  <input type="file" id="document__input" onChange={handleFileUpload} />
                  <label className={uploadedFileUrl ? 'disabled' : ''} htmlFor={uploadedFileUrl ? '' : "document__input"} onClick={(e) => handleMediaType(e, MEDIA_TYPE_DOC)}><GrDocumentText size={icon_size_small} color="#454545" /></label>
                </div>
                {/* <div className="icon__container">
                  <input type="file" id="poll__input" onChange={handleFileUpload}/>
                  <label className={uploadedFileUrl ? 'disabled' : ''} htmlFor={uploadedFileUrl ? '' :"poll__input"} onClick={(e) => handleMediaType(e,MEDIA_TYPE_POLL)}><FaPollH size={icon_size_small} color="#454545"/></label>
                </div> */}
              </div>
            </div>
            <hr className='postModal__linebreak' />
            <div className="post__modal__postButton">
              <button onClick={handleAddPost} className='post__modal__actual__button'>
                {isAdding ? <SpinnerCircularFixed color='white' size={25} /> : "Post"}
              </button>
            </div>
          </>
        ) : (
          <div className="post__second__modal">
            <div className="post__show__document">
              Hello
            </div>
            <div className="post__modal__postButton">
              <button onClick={submitFiles}>
                Add
              </button>
            </div>

          </div>
        )}
      </div>
    </>,
    document.getElementById('portal__create__post')
  )
}