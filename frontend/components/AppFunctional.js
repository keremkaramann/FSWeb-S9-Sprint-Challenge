import React from "react";
import { useState } from "react";
import axios from "axios";
// önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [initialMsg, setInitialMsg] = useState(initialMessage);
  const [initEmail, setInitEmail] = useState(initialEmail);
  const [initialStep, setInitialStep] = useState(initialSteps);
  const [activeInx, setActiveInx] = useState(initialIndex);

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    const x = (activeInx % 3) + 1;
    const y = Math.floor(activeInx / 3) + 1;
    return { x, y };
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    const { x, y } = getXY();
    return `Koordinatlar (${x}, ${y})`;
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setInitialMsg(initialMessage);
    setInitEmail(initialEmail);
    setInitialStep(initialSteps);
    setActiveInx(initialIndex);
  }
  function sonrakiIndex(yon) {
    let newIndex;

    switch (yon) {
      case "left":
        if (activeInx % 3 === 0) {
          setInitialMsg("You can't go left");
          return activeInx;
        }
        newIndex = activeInx - 1;
        setInitialMsg("");
        break;
      case "up":
        if (Math.floor(activeInx / 3) === 0) {
          setInitialMsg("You can't go up");
          return activeInx;
        }
        newIndex = activeInx - 3;
        setInitialMsg("");
        break;
      case "right":
        if (activeInx % 3 === 2) {
          setInitialMsg("You can't go right");
          return activeInx;
        }
        newIndex = activeInx + 1;
        setInitialMsg("");
        break;
      case "down":
        if (Math.floor(activeInx / 3) === 2) {
          setInitialMsg("You can't go down");
          return activeInx;
        }
        newIndex = activeInx + 3;
        setInitialMsg("");
        break;
      default:
        return activeInx;
    }

    return newIndex;
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const newIx = sonrakiIndex(evt);
    if (newIx === activeInx) {
      return;
    }
    setActiveInx(newIx);
    setInitialStep(initialStep + 1);
    if (initialMsg !== "You can't go left") {
      setInitialMsg("");
    }
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setInitEmail(evt.target.value);
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.

    evt.preventDefault();
    const { x, y } = getXY();
    const dataToSend = {
      x: x,
      y: y,
      steps: initialStep,
      email: initEmail,
    };
    axios
      .post("http://localhost:9000/api/result", dataToSend)
      .then((resp) => {
        setInitialMsg(resp.data.message);
      })
      .catch((err) => {
        console.log("Error: ", err);
        setInitialMsg("Ouch: email is required");
      });
  }
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{initialStep} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === activeInx ? " active" : ""}`}
          >
            {idx === activeInx ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{initialMsg} </h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => ilerle("left")}>
          SOL
        </button>
        <button id="up" onClick={() => ilerle("up")}>
          YUKARI
        </button>
        <button id="right" onClick={() => ilerle("right")}>
          SAĞ
        </button>
        <button id="down" onClick={() => ilerle("down")}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="email girin"
          onChange={(e) => onChange(e)}
          value={initEmail}
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
