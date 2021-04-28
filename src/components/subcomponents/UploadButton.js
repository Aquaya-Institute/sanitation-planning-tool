// import { useState } from "react";

// export const UploadButton = () => {
//   const [files, setFiles] = useState([]);

//   const getFileMetadata = (file) => {
//     /**
//      * The way we are handling uploads does not allow us to
//      * turn the uploaded [object File] into JSON.
//      *
//      * Therefore, we have to write our own "toJSON()" method.
//      */
//     return {
//       lastModified: file.lastModified,
//       name: file.name,
//       size: file.size,
//       type: file.type,
//       webkitRelativePath: file.webkitRelativePath,
//     };
//   };

//   const handleUpload = (e) => {
//     let newstate = [];
//     for (let i = 0; i < e.target.files.length; i++) {
//       let file = e.target.files[i];
//       let metadata = getFileMetadata(file);
//       let url = URL.createObjectURL(file);
//       newstate = [...newstate, { url, metadata }];
//     }
//     setFiles(newstate);
//   };

//   const handleSave = () => {
//     alert(`POST Files Here..\n\n ${JSON.stringify(files, null, 2)}`);
//   };

//   return (
//     <div>
//       <input type="file" accept="image/*" multiple onChange={handleUpload} />
//       <div>
//         <button onClick={handleSave} disabled={!(files && files.length > 0)}>
//           Save Image(s)
//         </button>
//       </div>
//       {files.map((f) => {
//         return (
//           <div>
//             <img src={f.url} height="100" width="100" />
//           </div>
//         );
//       })}
//     </div>
//   );
// };

import React, { useState } from "react";
import Papa from "papaparse";

export const UploadButton = () => {
  const [state, setState] = useState({
    csvfile: null,
  });

  function handleChange(event) {
    setState({
      csvfile: event.target.files[0],
    });
  }

  function importCSV(e) {
    e.preventDefault();
    const { csvfile } = state;

    csvfile &&
      Papa.parse(csvfile, {
        header: true,
        dynamicTyping: true,
        complete: updateData,
      });
  }

  function updateData(result) {
    setState({
      csvfile: null,
    });
    var data = result.data;
    console.log(data);
  }

  return (
    <div>
      <div className="upload">
        <p>Upload List of Community Coordinates</p>
        <input
          className="upload-input"
          type="file"
          name="file"
          placeholder={null}
          onChange={handleChange}
        />
        <p />
        <button onClick={importCSV}>Upload</button>
      </div>
    </div>
  );
};
