import { MEDIA_TYPE_IMAGES, MEDIA_TYPE_DOC, MEDIA_TYPE_VIDEO } from '../../firebase/firebase-config.js'

type Props = {
    mediaType: string,
    mediaURL: string,
    type?: string,
}
// style={{ height: `${mediaType === MEDIA_TYPE_DOC ? "200px" : mediaType === MEDIA_TYPE_VIDEO ? "100px" : "80px"}`,
//         width: `${mediaType === MEDIA_TYPE_VIDEO ? "100px" : ""}`,
//         border: `${type === EDUCATION_TITLE || mediaType === MEDIA_TYPE_VIDEO && "none"}`
//     }}

const ActivityMedia: React.FC<Props> = ({ mediaType, mediaURL }) => {
    
    return (
        <div className="profile__page__activity__media" >

            {
                mediaType === MEDIA_TYPE_IMAGES ? (
                    <img className='post__image__view' src={mediaURL} alt="Link broken" />
                ) : mediaType === MEDIA_TYPE_DOC ? (
                    <embed
                        src={mediaURL}
                        type="application/pdf"
                        width="100%"
                        height="200"
                        className="post__media__pdf__viewer"
                    />
                ) : mediaType === MEDIA_TYPE_VIDEO ? (
                    <video controls width="100%" height="300">
                        <source src={mediaURL} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <></>
                )
            }
        </div>
    )
}
export default ActivityMedia