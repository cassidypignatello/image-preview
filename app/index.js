import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class ImagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
      imageUrl: '',
      width: '',
      height: ''
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleCropChange = this.handleCropChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCropSubmit = this.handleCropSubmit.bind(this);
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

    reader.onloadend = () => {
      this.setState({
        file: file,
        imageUrl: reader.result
      });
    }

    reader.readAsDataURL(file);
  }

  handleSubmit(e) {
    e.preventDefault();
    // call function for API
  }

  handleCropSubmit() {

  }

  render() {
    let imagePreview = null;
    if (this.state.imageUrl) {
      imagePreview = (<img src={this.state.imageUrl}/>);
    } else {
      imagePreview = (<div>Please select an image</div>);
    }
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
            type='text'
            value={this.state.width}
            onChange={this.handleCropChange}
          />
          <label htmlFor='height'>
            Crop Height (max 100px)
          </label>
          <input
            className='heightSelect'
            name='height'
            type='text'
            value={this.state.height}
            onChange={this.handleCropChange}
          />
          <button
            className='button'
            type='submit'
            onClick={this.handleCropSubmit}>
            Crop Image
          </button>
        </form>
        <div className='preview'>
          {imagePreview}
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <ImagePreview />,
  document.getElementById('app')
);
