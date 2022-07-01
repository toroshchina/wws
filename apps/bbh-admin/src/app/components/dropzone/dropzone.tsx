/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import Close from '@material-ui/icons/Close';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import styles from './dropzone.module.scss';
import { useAuth } from '../../context/auth';

const Dropzone = forwardRef((props: any, ref) => {
  const { authTokens } = useAuth();
  const fileInputRef = useRef();
  const modalImageRef = useRef();
  const modalRef = useRef();
  const progressRef = useRef();
  const uploadRef = useRef();
  const uploadModalRef = useRef();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [validFiles, setValidFiles] = useState([]);
  const [unsupportedFiles, setUnsupportedFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const user = jwt_decode(authTokens.accessToken) as any;

  useImperativeHandle(ref, () => ({
    upload() {
      uploadFiles();
    },
  }));

  useEffect(() => {
    const filteredArr = selectedFiles.reduce((acc, current) => {
      const x = acc.find((item) => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    setValidFiles([...filteredArr]);
  }, [selectedFiles]);

  useEffect(() => {
    props.validate(unsupportedFiles.length === 0 && validFiles.length);
  }, [unsupportedFiles, validFiles, props]);

  const preventDefault = (e) => {
    e.preventDefault();
  };

  const dragOver = (e) => {
    preventDefault(e);
  };

  const dragEnter = (e) => {
    preventDefault(e);
  };

  const dragLeave = (e) => {
    preventDefault(e);
  };

  const fileDrop = (e) => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  };

  const filesSelected = () => {
    if ((fileInputRef as any).current.files.length) {
      handleFiles((fileInputRef as any).current.files);
    }
  };

  const fileInputClicked = () => {
    (fileInputRef as any).current.click();
  };

  const handleFiles = (files) => {
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
      } else {
        files[i]['invalid'] = true;
        setSelectedFiles((prevArray) => [...prevArray, files[i]]);
        setErrorMessage('Файлы не поддерживаются');
        setUnsupportedFiles((prevArray) => [...prevArray, files[i]]);
      }
    }
  };

  const validateFile = (file) => {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/x-icon',
    ];
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }

    return true;
  };

  const fileSize = (size) => {
    if (size === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileType = (fileName) => {
    return (
      fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) ||
      fileName
    );
  };

  const removeFile = (name) => {
    const index = validFiles.findIndex((e) => e.name === name);
    const index2 = selectedFiles.findIndex((e) => e.name === name);
    const index3 = unsupportedFiles.findIndex((e) => e.name === name);
    validFiles.splice(index, 1);
    selectedFiles.splice(index2, 1);
    setValidFiles([...validFiles]);
    setSelectedFiles([...selectedFiles]);
    if (index3 !== -1) {
      unsupportedFiles.splice(index3, 1);
      setUnsupportedFiles([...unsupportedFiles]);
    }
  };

  const openImageModal = (file) => {
    const reader = new FileReader();
    (modalRef as any).current.style.display = 'block';
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      (
        modalImageRef as any
      ).current.style.backgroundImage = `url(${e.target.result})`;
    };
  };

  const closeModal = () => {
    (modalRef as any).current.style.display = 'none';
    (modalImageRef as any).current.style.backgroundImage = 'none';
  };

  const uploadFiles = async () => {
    (uploadModalRef as any).current.style.display = 'block';
    (uploadRef as any).current.innerHTML = 'Загрузка файлов...';
    const formData = new FormData();
    for (let i = 0; i < validFiles.length; i++) {
      formData.append('photo_url', validFiles[i]);
    }
    formData.append('dateCreate', new Date().toUTCString());
    formData.append('usernameCreate', user.username);
    axios
      .post(`api/upload/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authTokens.accessToken}`,
        },
        onUploadProgress: (progressEvent) => {
          const uploadPercentage = Math.floor(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          (progressRef as any).current.innerHTML = `${uploadPercentage}%`;
          (progressRef as any).current.style.width = `${uploadPercentage}%`;

          if (uploadPercentage === 100) {
            (uploadRef as any).current.innerHTML = 'Файлы загружены';
            validFiles.length = 0;
            setValidFiles([...validFiles]);
            setSelectedFiles([...validFiles]);
            setUnsupportedFiles([...validFiles]);
          }
        },
      })
      .catch(() => {
        (
          uploadRef as any
        ).current.innerHTML = `<span class="error">Ошибка загрузки файлов</span>`;
        (progressRef as any).current.style.backgroundColor = 'red';
      });
  };

  const closeUploadModal = () => {
    (uploadModalRef as any).current.style.display = 'none';
  };

  return (
    <>
      <div className={styles['container']}>
        {props.showButton &&
        unsupportedFiles.length === 0 &&
        validFiles.length ? (
          <button
            className={styles['file-upload-btn']}
            onClick={() => uploadFiles()}
          >
            Загрузить файлы
          </button>
        ) : (
          ''
        )}
        {unsupportedFiles.length ? (
          <p>Удалите неподдерживаемые форматы изображений</p>
        ) : (
          ''
        )}
        <div
          className={styles['drop-container']}
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
          onClick={fileInputClicked}
        >
          <div className={styles['drop-message']}>
            <div className={styles['upload-icon']}></div>
            Перетащите изображения или нажмите на эту область
          </div>
          <input
            ref={fileInputRef}
            className={styles['file-input']}
            type="file"
            multiple
            onChange={filesSelected}
          />
        </div>
        <div className={styles['file-display-container']}>
          {validFiles.map((data, i) => (
            <div className={styles['file-status-bar']} key={i}>
              <div
                onClick={
                  !data.invalid
                    ? () => openImageModal(data)
                    : () => removeFile(data.name)
                }
              >
                <div className={styles['file-type-logo']}></div>
                <div className={styles['file-type']}>{fileType(data.name)}</div>
                <span
                  className={`file-name ${data.invalid ? 'file-error' : ''}`}
                >
                  {data.name}
                </span>
                <span className={styles['file-size']}>
                  ({fileSize(data.size)})
                </span>{' '}
                {data.invalid && (
                  <span className={styles['file-error-message']}>
                    ({errorMessage})
                  </span>
                )}
              </div>
              <div
                className={styles['file-remove']}
                onClick={() => removeFile(data.name)}
              >
                X
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles['modal']} ref={modalRef}>
        <div className={styles['overlay']}></div>
        <span className={styles['close']} onClick={() => closeModal()}>
          <Close />
        </span>
        <div className={styles['modal-image']} ref={modalImageRef}></div>
      </div>

      <div className={styles['upload-modal']} ref={uploadModalRef}>
        <div className={styles['overlay']}></div>
        <div className={styles['close']} onClick={() => closeUploadModal()}>
          <Close />
        </div>
        <div className={styles['progress-container']}>
          <span ref={uploadRef}></span>
          <div className={styles['progress']}>
            <div className={styles['progress-bar']} ref={progressRef}></div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Dropzone;
