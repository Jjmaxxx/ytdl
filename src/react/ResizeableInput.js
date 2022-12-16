// import { realpathSync } from "fs";
// import React from "react";
// import styled, { css } from 'styled-components'
// const SentenceInput = styled.input`
//   padding: 0;
//   margin: 0;
//   border: none;
//   border: 1px solid black;
//   /* added styles */
//   font-family: inherit;
//   font-size: inherit;
//   position: absolute;
//   vertical-align: top;
//   top: 0;
//   left: 0;
//   width: 100%;
//   background: white;
// `

// const Label = styled.label`
//   display: inline-block;
//   position: relative;
//   min-width: 2em;
//   min-height: 1.4em;
// `

// const Template = styled.span`
//   white-space: pre;
//   /* max-width : could be wised to set a maximum width and overflow:hidden; */
// `
// class ResizableInput extends React.Component{
//     render(){
//     const [value, setValue] = React.useState(initialValue)
//     return (
//       <Label>
//       <Template>{value}</Template>
//       <SentenceInput
//         type="text"
//         value={value}
//         onChange={(event) => {
//           setValue(event.target.value)
//         }}
//       />
//       </Label>
//     )
//   }
// }

// https://dev.to/isabelxklee/understanding-inverse-data-flow-in-react-3cg7
// https://stackoverflow.com/questions/64092841/react-how-to-make-an-input-only-as-wide-as-the-amount-of-text-provided