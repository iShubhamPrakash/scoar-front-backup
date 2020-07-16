import React, { Component } from "react";
import "flexboxgrid";
import dataJson from "./data.json";
import { SketchField, Tools } from "react-sketch";
import { LeftToolBar, RightToolBar, TopToolBar } from "../Toolbar";

class WhiteBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lineWidth: 4,
      lineColor: "black",
      fillColor: "#68CCCA",
      backgroundColor: "transparent",
      shadowWidth: 0,
      shadowOffset: 0,
      tool: Tools.Pencil,
      enableRemoveSelected: false,
      fillWithColor: false,
      fillWithBackgroundColor: false,
      drawings: [],
      canUndo: false,
      canRedo: false,
      controlledSize: true,
      sketchWidth: window.innerWidth,
      sketchHeight: window.innerHeight,
      stretched: true,
      stretchedX: false,
      stretchedY: false,
      originX: "left",
      originY: "top",
      imageUrl: "https://files.gamebanana.com/img/ico/sprays/4ea2f4dad8d6f.png",
      expandTools: false,
      expandControls: false,
      expandColors: false,
      expandBack: false,
      expandImages: false,
      expandControlled: false,
      text: "a text, cool!",
      enableCopyPaste: false,
    };
  }

  _selectTool = (tool) => {
    this.setState({
      tool: tool,
      enableRemoveSelected: tool === Tools.Select,
      enableCopyPaste: tool === Tools.Select,
    });
  };

  _save = () => {
    let drawings = this.state.drawings;
    drawings.push(this._sketch.toDataURL());
    this.setState({ drawings: drawings });
  };

  _download = () => {
    // console.log(this._sketch.toDataURL());
    console.log(this._sketch.toJSON());
  };

  _removeMe = (index) => {
    let drawings = this.state.drawings;
    drawings.splice(index, 1);
    this.setState({ drawings: drawings });
  };

  _undo = () => {
    this._sketch.undo();
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _redo = () => {
    this._sketch.redo();
    this.setState({
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _clear = () => {
    this._sketch.clear();
    this._sketch.setBackgroundFromDataUrl("");
    this.setState({
      controlledValue: null,
      backgroundColor: "transparent",
      fillWithBackgroundColor: false,
      canUndo: this._sketch.canUndo(),
      canRedo: this._sketch.canRedo(),
    });
  };

  _removeSelected = () => {
    this._sketch.removeSelected();
  };

  _onSketchChange = () => {
    let prev = this.state.canUndo;
    let now = this._sketch.canUndo();
    if (prev !== now) {
      this.setState({ canUndo: now });
    }
  };

  _onBackgroundImageDrop = (accepted /*, rejected*/) => {
    if (accepted && accepted.length > 0) {
      let sketch = this._sketch;
      let reader = new FileReader();
      let { stretched, stretchedX, stretchedY, originX, originY } = this.state;
      reader.addEventListener(
        "load",
        () =>
          sketch.setBackgroundFromDataUrl(reader.result, {
            stretched: stretched,
            stretchedX: stretchedX,
            stretchedY: stretchedY,
            originX: originX,
            originY: originY,
          }),
        false
      );
      reader.readAsDataURL(accepted[0]);
    }
  };

  _addText = () => this._sketch.addText(this.state.text || "Hello world !");

  render = () => {
    let { controlledValue } = this.state;
    return (
      <div className="whiteboard">
				
        <TopToolBar />

        <LeftToolBar
          Tools={Tools}
          canvasCLEAR={this._clear}
          canvasUNDO={this._undo}
          undoDisabled={!this.state.canUndo}
          canvasREDO={this._redo}
          redoDisabled={!this.state.canRedo}
          addText={this._addText}
          brushRadius={this.state.lineWidth}
          setBrushRadius={(val) => this.setState({ lineWidth: val })}
          selectTool={(val) => this._selectTool(val)}
          removeSelected={this._removeSelected}
          copyPasteDisabled={!this.state.enableCopyPaste}
          copy={(e) => this._sketch.copy()}
          paste={(e) => this._sketch.paste()}
          fillWithColor={this.state.fillWithColor}
          toggleFillWithColor={(val) => this.setState({ fillWithColor: val })}
          lineColor={this.state.lineColor}
          setLineColor={(color) => this.setState({ lineColor: color })}
          fillColor={this.state.fillColor}
          setFillColor={(color) => this.setState({ fillColor: color })}
          addImage={(imageURL) => this._sketch.addImg(imageURL)}
        />

        <RightToolBar
          Tools={Tools}
          selectTool={(val) => this._selectTool(val)}
          increaseCanvasSize={(e) => this._sketch.zoom(1.25)}
          decreaseCanvasSize={(e) => this._sketch.zoom(0.8)}
        />

        <div className="row">
          <div className="col-12">
            <SketchField
              name="sketch"
              className="canvas-area"
              ref={(c) => (this._sketch = c)}
              lineColor={this.state.lineColor}
              lineWidth={this.state.lineWidth}
              fillColor={
                this.state.fillWithColor ? this.state.fillColor : "transparent"
              }
              backgroundColor={
                this.state.fillWithBackgroundColor
                  ? this.state.backgroundColor
                  : "transparent"
              }
              width={this.state.controlledSize ? this.state.sketchWidth : null}
              height={
                this.state.controlledSize ? this.state.sketchHeight : null
              }
              defaultValue={dataJson}
              value={controlledValue}
              forceValue
              onChange={this._onSketchChange}
              tool={this.state.tool}
            />
          </div>
        </div>

        <div style={{ width: 0 }}>
          <div className="col-xs-7 col-sm-7 col-md-9 col-lg-9">
            {/* Sketch area */}

            <div className="col-xs-5 col-sm-5 col-md-3 col-lg-3"></div>
          </div>
        </div>
      </div>
    );
  };
}

export default WhiteBoard;