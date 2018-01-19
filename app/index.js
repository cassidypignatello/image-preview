import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { saveImage } from './utils/api';

class ImagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imageUrl: '',
      width: '',
      height: '',
      x: '',
      y: '',
      maxWidth: 800,
      maxHeight: 100,
      cropped: false,
      saved: false
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleCropChange = this.handleCropChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCropSubmit = this.handleCropSubmit.bind(this);
    this.handleCropSave = this.handleCropSave.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handlePrint = this.handlePrint.bind(this);
  }

  handleCropChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleImageChange(e) {
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];
    const filesize = ((file.size / 1024) / 1024).toFixed(4);

    reader.onloadend = () => {
      if (filesize <= 1) {
        this.setState({
          file,
          imageUrl: reader.result
        });
      } else {
        alert('You must choose an image that\'s 1MB or less!');
      }
    }

    reader.readAsDataURL(file);
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  handleCropSubmit() {
    const newImage = new Image();
    const { imageUrl, width, height, x, y } = this.state;
    newImage.src = imageUrl;

    const canvas = document.createElement('canvas');
    const canvasContext = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    const bufferCanvas = document.createElement('canvas');
    const bufferContext = bufferCanvas.getContext('2d');
    bufferCanvas.width = newImage.width;
    bufferCanvas.height = newImage.height;
    bufferContext.drawImage(newImage, 0, 0);

    canvasContext.drawImage(
      bufferCanvas,
      x,
      y,
      width,
      height,
      0,
      0,
      width,
      height);
    this.setState({
      imageUrl: canvas.toDataURL('image/png'),
      cropped: true
    });
  }

  handleCropSave() {
    const { file, imageUrl } = this.state;
    if (!file) {
      alert('No image selected!');
    } else {
      saveImage(imageUrl).then((data) => {
        this.setState({
          imageUrl: data,
          saved: true
        });
      }.bind(this));
    }
  }

  handleReset() {
    this.setState({
      file: '',
      imageUrl: ''
    })
  }

  handlePrint() {
    const win = window.open();
    const { imageUrl } = this.state;
    win.document.write(`<div style='display: flex; justify-content: center'>
                          <img src=${imageUrl}/>
                        <div>`);
    win.focus();
    win.print();
    win.close();
  }

  render() {
    const { width, height, x, y, maxWidth, maxHeight, file, saved, imageUrl } = this.state;
    return(
      <div className='container'>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='image'>
            Choose image for upload (max 1MB)
          </label>
          <input
            className='imageSelect'
            name='image'
            type='file'
            accept='image/*'
            onChange={this.handleImageChange}
          />
          <label htmlFor='width'>
            Crop Width (max 800px)
          </label>
          <input
            className='widthSelect'
            name='width'
            type='number'
            value={width}
            onChange={this.handleCropChange}
          />
          <label htmlFor='height'>
            Crop Height (max 100px)
          </label>
          <input
            className='heightSelect'
            name='height'
            type='number'
            value={height}
            onChange={this.handleCropChange}
          />
          <label htmlFor='x'>
            Start from X-Axis
          </label>
          <input
            className='xSelect'
            name='x'
            type='number'
            value={x}
            onChange={this.handleCropChange}
          />
          <label htmlFor='y'>
            Start from Y-Axis
          </label>
          <input
            className='ySelect'
            name='y'
            type='number'
            value={y}
            onChange={this.handleCropChange}
          />
          <button
            className='button'
            type='submit'
            onClick={this.handleCropSubmit}
            disabled={!width ||
                      !height ||
                      width > maxWidth ||
                      height > maxHeight}>
            Crop Image
          </button>
          <button
            className='button'
            type='submit'
            onClick={this.handleReset}
            disabled={!file}>
            Clear Image
          </button>
          <button
            className='button'
            type='submit'
            onClick={this.handleCropSave}>
            Save Image
          </button>
          <button
            className='button'
            type='submit'
            onClick={this.handlePrint}
            disabled={!saved}>
            Print Preview
          </button>
        </form>
        <div className='preview'>
          {imageUrl &&
          <img src={imageUrl}/> ||
          <div>Please select an image</div>}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <ImagePreview />,
  document.getElementById('app')
);
