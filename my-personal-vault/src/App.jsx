import React, { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import confetti from "canvas-confetti";

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(135deg, #232526 0%, #1c92d2 100%);
    margin: 0;
    font-family: 'JetBrains Mono', 'Fira Mono', monospace, sans-serif;
    color: #eee;
    min-height: 100vh;
    min-width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;


const Container = styled.div`
  width: 100%;
  max-width: 550px;
  /* margin: auto;        REMOVE any margin that offsets it! */
  padding: 2rem 2.5rem 3rem 2.5rem;
  background: rgba(33, 36, 49, 0.92);
  border-radius: 22px;
  box-shadow: 0 4px 32px #0d2135bb;
  position: relative;
  z-index: 10;
`;


const FireworksCanvas = styled.canvas`
  position: fixed;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 5;
  opacity: 1;
`;

const Title = styled.h1`
  letter-spacing: 0.04em;
  background: linear-gradient(90deg, #02aaff, #51ffbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 32px;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 28px;
`;

const Tab = styled.button`
  font-size: 1.12rem;
  background: ${({ selected }) => (selected ? "linear-gradient(90deg, #02aaff, #51ffbf)" : "#292f47")};
  color: ${({ selected }) => (selected ? "#00192b" : "#eee")};
  border: 0;
  border-radius: 9px;
  padding: 10px 30px;
  box-shadow: ${({ selected }) => (selected ? "0 3px 16px #05dedf55" : "none")};
  cursor: pointer;
  transition: 0.15s;
  font-weight: bold;
  margin: 0 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 10px;
`;

const Input = styled.input`
  font-size: 1rem;
  padding: 10px;
  border: none;
  border-radius: 7px;
  background: #464a5b;
  color: #fff;
  outline: none;
`;

const TextArea = styled.textarea`
  min-height: 60px;
  font-size: 1rem;
  padding: 10px;
  border: none;
  border-radius: 7px;
  background: #464a5b;
  color: #fff;
  outline: none;
`;

const ListContainer = styled.div`
  margin: 20px 0 0 0;
  border-top: 1px solid #234c86bb;
  padding-top: 12px;
`;

const Item = styled.div`
  background: #313952;
  margin-bottom: 12px;
  border-radius: 9px;
  padding: 12px 16px;
  box-shadow: 0 2px 12px #05a3e355;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  border: none;
  background: linear-gradient(90deg, #f7971e, #ffd200);
  color: #222;
  font-weight: bold;
  border-radius: 8px;
  padding: 6px 18px;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    background: linear-gradient(90deg, #fd5c52, #fcb045);
    color: #fff;
  }
`;

const FileLink = styled.a`
  color: #59ffd0;
  text-decoration: underline;
`;

const categories = ["Quotes", "Notes", "Files"];

function App() {
  const [tab, setTab] = useState(categories[0]);
  const [quotes, setQuotes] = useState([]);
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);
  const [quoteInput, setQuoteInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState(null);
  const canvasRef = useRef();

  useEffect(() => {
    setQuotes(JSON.parse(localStorage.getItem("quotes") || "[]"));
    setNotes(JSON.parse(localStorage.getItem("notes") || "[]"));
    setFiles(JSON.parse(localStorage.getItem("files") || "[]"));

    // On mount, launch a startup fireworks burst!
    triggerFireworks();
  }, []);
  useEffect(() => {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }, [quotes]);
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem("files", JSON.stringify(files));
  }, [files]);

  function triggerFireworks() {
    if (!canvasRef.current) return;

    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        confetti.create(canvasRef.current, { resize: true })({
          particleCount: 72,
          spread: 72,
          startVelocity: 47,
          ticks: 260,
          origin: {
            x: Math.random(),
            y: Math.random() * 0.6
          }
        });
      }, i * 340);
    }
  }

  const handleQuoteAdd = (e) => {
    e.preventDefault();
    if (quoteInput.trim()) {
      setQuotes([{ text: quoteInput, time: Date.now() }, ...quotes]);
      setQuoteInput("");
      triggerFireworks();
    }
  };

  const handleNoteAdd = (e) => {
    e.preventDefault();
    if (noteInput.trim()) {
      setNotes([{ text: noteInput, time: Date.now() }, ...notes]);
      setNoteInput("");
      triggerFireworks();
    }
  };

  const handleFileAdd = (e) => {
    e.preventDefault();
    if (fileName && fileData) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setFiles([
          { name: fileName, url: event.target.result, time: Date.now() },
          ...files,
        ]);
        setFileName("");
        setFileData(null);
        triggerFireworks();
      };
      reader.readAsDataURL(fileData);
    }
  };

  const handleRemove = (list, setList, idx) => {
    setList(list.filter((_, i) => i !== idx));
  };

  return (
    <>
      <GlobalStyle />
      {/* Fireworks overlay */}
      <FireworksCanvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
      <Container>
        <Title>✨ My Personal Vault</Title>
        <Tabs>
          {categories.map((cat) => (
            <Tab key={cat} selected={cat === tab} onClick={() => setTab(cat)}>
              {cat}
            </Tab>
          ))}
        </Tabs>
        {/* FORMS */}
        {tab === "Quotes" && (
          <Form onSubmit={handleQuoteAdd}>
            <TextArea
              value={quoteInput}
              onChange={(e) => setQuoteInput(e.target.value)}
              placeholder="Add your favorite quote…"
              required
            />
            <Button type="submit">+ Add Quote</Button>
          </Form>
        )}
        {tab === "Notes" && (
          <Form onSubmit={handleNoteAdd}>
            <TextArea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Quick key note..."
              required
            />
            <Button type="submit">+ Add Note</Button>
          </Form>
        )}
        {tab === "Files" && (
          <Form onSubmit={handleFileAdd}>
            <Input
              type="text"
              placeholder="File name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />
            <Input
              type="file"
              onChange={(e) => setFileData(e.target.files[0])}
              required
            />
            <Button type="submit">+ Upload File</Button>
          </Form>
        )}
        {/* LIST */}
        <ListContainer>
          {tab === "Quotes" &&
            (quotes.length === 0 ? (
              <p>No quotes added yet.</p>
            ) : (
              quotes.map((q, i) => (
                <Item key={q.time}>
                  <span>"{q.text}"</span>
                  <Actions>
                    <Button onClick={() => handleRemove(quotes, setQuotes, i)}>
                      Delete
                    </Button>
                  </Actions>
                </Item>
              ))
            ))}
          {tab === "Notes" &&
            (notes.length === 0 ? (
              <p>No notes yet.</p>
            ) : (
              notes.map((n, i) => (
                <Item key={n.time}>
                  <span>{n.text}</span>
                  <Actions>
                    <Button onClick={() => handleRemove(notes, setNotes, i)}>
                      Delete
                    </Button>
                  </Actions>
                </Item>
              ))
            ))}
          {tab === "Files" &&
            (files.length === 0 ? (
              <p>No files uploaded yet.</p>
            ) : (
              files.map((f, i) => (
                <Item key={f.time}>
                  <FileLink href={f.url} download={f.name} target="_blank">
                    {f.name}
                  </FileLink>
                  <Actions>
                    <Button onClick={() => handleRemove(files, setFiles, i)}>
                      Delete
                    </Button>
                  </Actions>
                </Item>
              ))
            ))}
        </ListContainer>
      </Container>
    </>
  );
}

export default App;
