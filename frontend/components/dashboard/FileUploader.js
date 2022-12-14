import { formatSize } from '../../systems/utils';
import { Form, Modal, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const MAX_SIZE = 10 * 1024 * 1024 - 1; // 10MB

export default function FileUploader() {
  const [fileList, setFileList] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const { Dragger } = Upload;

  const uploadProps = {
    name: 'file',
    multiple: false,
    directory: false,

    beforeUpload: async (file) => {
      // Don't allow directories
      if (file.size === '' || file.size === 0) {
        toast.error('Please upload files one at a time');
        return Upload.LIST_IGNORE;
      }

      let fileListSize = getTotalSize(fileList);
      // If it exceeds the max size, don't add the last file
      if (fileListSize + file.size > MAX_SIZE) {
        toast.error(`Total size exceeds ${formatSize(MAX_SIZE)}`);
        return Upload.LIST_IGNORE;
      } else {
        setTotalSize(fileListSize + file.size);
        setFileList([...fileList, file]);
        toast.info(`Added ${file.name}`);
      }
    },

    onRemove: (file) => {
      setTotalSize(getTotalSize(fileList) - file.size);
      setFileList(fileList.filter((f) => f.uid !== file.uid));
      toast.info(`Removed ${file.name}`);
    },
  };

  const getTotalSize = (files) => {
    if (files.length === 0) return 0;
    return files.reduce((acc, file) => acc + file.size, 0);
  };

  const getFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };

  return (
    <Form.Item
      label='Files to upload'
      required
      name='upload'
      valuePropName='fileList'
      getValueFromEvent={getFile}
    >
      <Dragger
        {...uploadProps}
        fileList={fileList}
        action={false}
        customRequest={({ onSuccess }) =>
          setTimeout(() => {
            onSuccess('ok', null);
          }, 0)
        }
      >
        <p className='ant-upload-drag-icon'>
          <InboxOutlined />
        </p>
        <p className='ant-upload-text'>
          Click or drag file to this area to upload
        </p>
        <p className='ant-upload-hint'>
          {formatSize(totalSize)} / {formatSize(MAX_SIZE)}
        </p>
        <h1 className='ant-upload-hint warning-message'>
          <i className='fas fa-exclamation-triangle'></i>
        </h1>
        <p className='ant-upload-hint warning-message underline'>
          Please do not upload any files that contain sensitive information.
        </p>

        <p className='ant-upload-hint warning-message'>
          Uploading a file to IPFS and/or Arweave is a permanent action. You
          will not be able to delete it once it is uploaded.
        </p>

        <p className='ant-upload-hint warning-message'>
          Please make sure you have the correct file before uploading.
        </p>
      </Dragger>
    </Form.Item>
  );
}
