import React, { useState, Fragment } from "react";
import InstAI_icon from "./images/instai_icon.png";
import axios from "axios";

import './Txt2Img.css';

const Txt2Img = () => {
  const [isGenerate, setGenerate] = useState(false);
  const [status, setStatus] = useState('Default');
  const [images, setImages] = useState([]);

  const [formData, setformData] = useState(
    {
      "enable_hr": false,
      "denoising_strength": 0,
      "hr_scale": 2,
      "hr_upscaler": "Latent",
      "hr_second_pass_steps": 0,
      "hr_resize_x": 0,
      "hr_resize_y": 0,
      "prompt": "",
      "styles": [],
      "seed": -1,
      "batch_size": 1,
      "n_iter": 1,
      "steps": 20,
      "cfg_scale": 7,
      "width": 512,
      "height": 512,
      "restore_faces": false,
      "tiling": false,
      "negative_prompt": "",
      "eta": 0,
      "override_settings": {
          "sd_model_checkpoint": "v1-5-pruned-emaonly.safetensors [6ce0161689]"
      },
      "script_args": [],
      "sampler_index": "Euler a",
      "alwayson_scripts": {}
  }
);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData(prevState => ({
      ...prevState,
      [name]: value
    }))
  };

  const handleGenerate = async (e) => {
    setImages([]);
    e.preventDefault();
    const data = formData;
    try {
        setGenerate(true)
        setStatus('Generating')
        const response = await axios.post("http://localhost:8080/", data);
        setImages(response.data.images);
    } catch (error) {
        console.error("Error generating images:", error)
    }
    setStatus('Done')
    setGenerate(false)
  }

  const downloadAllImg = () => {
    images.forEach(image => {downloadImg(image)});
  };

  const downloadImg = (image) => {
    const byteString = atob(image.content);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: 'image/png' }); // 根據需要更改 MIME 類型
    const url = URL.createObjectURL(blob);

    // 創建隱藏的 <a> 元素並觸發下載
    const link = document.createElement('a');
    link.href = url;
    link.download = image.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 釋放 URL
    URL.revokeObjectURL(url);
  }

  return(
    <div className="page">
      <div className="page-container">
        <div className="col-12">
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" />
        </div>
        <div className="main-container"> 
          <div className="form-container">
            <form onSubmit={handleGenerate}>
              
              <div className="form-group">
                <label className="label">Prompt</label>
                <input name="prompt" value={formData.prompt} onChange={handleChange} type='text'  placeholder ="Please enter prompt for image generation" readOnly={isGenerate}/>
              </div>
              
              <div className="form-group">
                <label className="label">Negative Prompt</label>
                <input name="negative_prompt" value={formData.negative_prompt} onChange={handleChange} type='text' placeholder ="Please enter negative prompt for image generation" readOnly={isGenerate}/>
              </div>


              <div className="form-group-row">

                <div className="widths">
                  <label className="label">Width</label>
                  <input className="width" name="width" value={formData.width} onChange={handleChange} type='number' readOnly={isGenerate}/>
                  <input className="width" name="width" value={formData.width} onChange={handleChange} type='range' min="64" max="2048" disabled={isGenerate}/>
                </div>
                
                <div className="batch_sizes">
                  <label className="label">Batch Size</label>
                  <input className="batch_size" name="batch_size" value={formData.batch_size} onChange={handleChange} type='number' readOnly={isGenerate}/>
                  <input className="batch_size" name="batch_size" value={formData.batch_size} onChange={handleChange} type='range' min="1" max="8" disabled={isGenerate}/>
                </div>
              </div>


              <div className="form-group">
                <label className="label">Height</label>
                <input className="height" name="height" value={formData.height} onChange={handleChange} type='number' readOnly={isGenerate}/>
                <input className="height"name="height" value={formData.height} onChange={handleChange} type='range' min="64" max="2048" disabled={isGenerate}/>
              </div>

              <div style={{ display: "flex", flexDirection: "row",marginTop: "3%"}}>
                <button type='submit' disabled={isGenerate}>{isGenerate ? 'Generating' : 'Generate'}</button>
                <button type='button' disabled={isGenerate} onClick={downloadAllImg}>Download All</button>
              </div>
              
            </form>
          </div>

          <div className="image-container">
            {(status == "Default") && <div className="placeholder">No images</div>}
            {!(status == "Default") && (images.length > 0 ?(
              <div className="image-gallery" style={{ overflowY: 'auto', width: "100%", Height: '100%', padding: '10px'}}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {images.map((img, index) => (
                    <div key={index} style={{ width: 'calc(50% - 10px)', marginBottom: '10px'}}>
                      <img
                        src={`data:image/jpeg;base64,${img.content}`}
                        alt={`Generated ${index}`}
                        className="img"
                        style={{ width: '100%', height: 'auto', borderRadius: '8px', cursor: "pointer" }}
                        onClick={() => downloadImg(img)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ):(
              <p className="status"  style={{margin: "0%"}}>Loading images...</p>
            ))}
          </div>
        </div>
      </div>
  
    </div>
  )


}

export default Txt2Img