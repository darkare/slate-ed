// import './App.css';
import React, { useEffect, useState, useCallback } from "react";
// Import the `Editor` and `Transforms` helpers from Slate.
import { Editor, Transforms, Element, createEditor } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from "slate-react";
import { useDebounceCallback } from "usehooks-ts";
import "./SlateEditor.css";
const defaultValue = [
  {
    type: "paragraph",
    children: [{ text: "This is a line for the Slate Editor" }],
  },
];
const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const SlateEditor = ({ onChange, name, value }) => {
  console.log("111-value", {value});
  const [content, setContent] = useState();
  // useEffect(() => {
  //   if (value) {
  //     setContent(JSON.parse(value));
  //   } else {
  //     setContent(defaultValue);
  //   }
  // }, []);

  useEffect(() => {
    console.log("111-10-useEffect", { name, content });
    onChange({ target: { name, value: JSON.stringify(content) } });
  }, [name, content, onChange]);

  const debouncedUpdates = useDebounceCallback(async (val) => {
    setContent(val);
  }, 500);

  // Define a React component renderer for our code blocks.
  const CodeElement = (props) => {
    return (
      <pre {...props.attributes}>
        <code>{props.children}</code>
      </pre>
    );
  };
  const [editor] = useState(() => withReact(createEditor()));

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  // Define a React component to render leaves with bold text.
  const Leaf = (props) => {
    return (
      <span
        {...props.attributes}
        style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
      >
        {props.children}
      </span>
    );
  };
  // Define a leaf rendering function that is memoized with `useCallback`.
  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);
  console.log('111-value-2', {v:value, vb: value === null});
  return (
    // Add the editable component inside the context.
    <Slate
      editor={editor}
      initialValue={value? JSON.parse(value) : defaultValue}
      onChange={(value) => {
        console.log("111-onChange", value);
        const isAstChange = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isAstChange) {
          debouncedUpdates(value);
          // console.log('111-onChange',value);
          // setContent(value);
        }
      }}
    >
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          if (!event.ctrlKey) {
            return;
          }
          switch (event.key) {
            case "`": {
              event.preventDefault();
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "code",
              });
              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "code" },
                {
                  match: (n) =>
                    Element.isElement(n) && Editor.isBlock(editor, n),
                }
              );
              break;
            }
            case "b": {
              event.preventDefault();
              Editor.addMark(editor, "bold", true);
              break;
            }
            default: {
              break;
            }
          }
        }}
      />
    </Slate>
  );
};

export default SlateEditor;
