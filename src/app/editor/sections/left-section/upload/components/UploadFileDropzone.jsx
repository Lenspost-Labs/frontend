import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import TiDelete from "@meronex/icons/ti/TiDelete";
import {
  claimReward,
  uploadUserAssets,
} from "../../../../../../services/apis/BE-apis/backendApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { errorMessage } from "../../../../../../utils/errorMessage";
import useUser from "../../../../../../hooks/user/useUser";

const UploadFileDropzone = () => {
  const [stFiles, setStFiles] = useState([]);
  const queryClient = useQueryClient();
  const { points } = useUser();

  // get the base64 string of the file
  const getBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });
  };

  // function for drop/add image to upload
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: async (acceptedFiles) => {
      if (points < 1) {
        toast.error("You don't have enough points to upload an image");
        return;
      }
      // If it's an SVG throw error
      if (acceptedFiles[0].type === "image/svg+xml") {
        toast.error("Please upload an image file other than SVG");
        return;
      }
      acceptedFiles.forEach(async (file) => {
        const base64String = await getBase64(file);

        setStFiles((prev) => [
          ...prev,
          Object.assign(file, {
            preview: URL.createObjectURL(file),
            base64String,
          }),
        ]);
      });
    },
  });

  // mutate function for upload image
  const { mutateAsync } = useMutation({
    mutationKey: "uploadUaserAssets",
    mutationFn: uploadUserAssets,
    onSuccess: () => {
      queryClient.invalidateQueries(["userAssets"], { exact: true });
    },
  });

  // function for remove image from dropzone
  const removeFile = (index) => {
    const newFiles = [...stFiles];
    newFiles.splice(index, 1);
    setStFiles(newFiles);
  };

  const thumbs = stFiles.map((file, index) => (
    <div className="" key={file.name}>
      <div className="border border-dashed border-gray-300 p-1 relative">
        <img
          src={file.preview}
          className="block w-auto h-full"
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
        <TiDelete
          className="h-6 w-6 cursor-pointer absolute top-1 right-1"
          color="red"
          onClick={() => removeFile(index)}
        />
      </div>
    </div>
  ));

  // Not needed as it's handled by BE
  // const fnUploadFilesByBURN = (toastId) => {
  //   claimReward({ taskId: 17 })
  //     .then(() => {
  //       mutateAsync(stFiles[0].base64String)
  //         .then((res) => {
  //           toast.update(toastId, {
  //             render: res?.data,
  //             type: "success",
  //             isLoading: false,
  //             autoClose: 3000,
  //             closeButton: true,
  //           });
  //         })
  //         .catch((err) => {
  //           toast.update(toastId, {
  //             render: errorMessage(err),
  //             type: "error",
  //             isLoading: false,
  //             autoClose: 3000,
  //             closeButton: true,
  //           });
  //         });
  //       setStFiles([]);
  //     })
  //     .catch((err) => {
  //       toast.update(toastId, {
  //         render: errorMessage(err),
  //         type: "error",
  //         isLoading: false,
  //         autoClose: 3000,
  //         closeButton: true,
  //       });
  //     });
  // };

  useEffect(() => {
    if (stFiles.length > 0) {
      const toastId = toast.loading("Uploading file...");
      mutateAsync(stFiles[0].base64String)
        .then((res) => {
          if (res?.s3link) {
            toast.update(toastId, {
              render: "File Uploaded Successfully",
              type: "success",
              isLoading: false,
              autoClose: 3000,
              closeButton: true,
            });
            setStFiles([]);
          } else {
            toast.update(toastId, {
              render: "Error uploading file",
              type: "error",
              isLoading: false,
              autoClose: 3000,
              closeButton: true,
            });
            // Claim by TaskId 17
            // fnUploadFilesByBURN();
          }
          setStFiles([]);
        })
        .catch((err) => {
          // fnUploadFilesByBURN(toastId);
          toast.update(toastId, {
            render: errorMessage(err),
            type: "error",
            isLoading: false,
            autoClose: 3000,
            closeButton: true,
          })
          setStFiles([]);
        });
    }

    return () => stFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [stFiles]);

  return (
    <>
      <section
        {...getRootProps({ refKey: "innerRef" })}
        className="p-4 outline-none rounded-lg border border-dashed border-blue-500 cursor-pointer active:border-blue-200"
      >
        <div className="outline-none">
          <input {...getInputProps()} />
          <p>Drag 'n' drop, or Click to browse files</p>
        </div>
      </section>
      <aside className="flex flex-row flex-wrap mt-4">{thumbs}</aside>
    </>
  );
};

export default UploadFileDropzone;
