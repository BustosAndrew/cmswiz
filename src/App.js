import { useState, useEffect } from "react"
import React from "react"

function App() {
	const [tries, setTries] = useState(3)
	const [toggleSymbol, setToggleSymbol] = useState(false)
	const [disableSubmit, setDisableSubmit] = useState(true)
	const [history, setHistory] = useState([])
	const [prompt, setPrompt] = useState("")
	const [answer, setAnswer] = useState("")

	// const urlPattern = /((http|https):\/\/[^\s]+)/g
	// const isLink = (word) => urlPattern.test(word)
	// const renderWord = (word) => {
	// 	if (isLink(word)) {
	// 		return (
	// 			<a href={word} key={word}>
	// 				<span>{word}</span>
	// 			</a>
	// 		)
	// 	}
	// 	return word
	// }

	const handleSubmit = async () => {
		setAnswer("Loading...")
		setDisableSubmit(true)
		const res = await fetch("http://127.0.0.1:8000/api/prompt/", {
			method: "POST",
			body: JSON.stringify({ prompt: prompt }),
		})

		const { answer } = await res.json()

		if (res.ok) {
			// const words = answer.split(" ")
			// const renderTextWithLinks = words.map(renderWord)
			setHistory([...history, { prompt: prompt, answer: answer }])
			setAnswer(answer)
			setTries(tries - 1)
		} else {
			setAnswer("Network request failed. Please try again later.")
			setDisableSubmit(false)
		}
	}

	useEffect(() => {
		if (prompt) setDisableSubmit(false)
		else setDisableSubmit(true)
	}, [prompt])

	return (
		<div className='flex flex-col justify-center items-center gap-10 py-10'>
			<h1 className='text-white font-bold text-5xl'>TicketBot</h1>
			<div className='max-w-xl drop-shadow-lg flex flex-col items-center w-10/12 gap-5 bg-white p-10 rounded'>
				<h3 className='text-lg mr-auto'>Enter your question:</h3>
				<textarea
					className='box-border w-full resize-none border-2 rounded border-solid border-cyan-700 hover:border-cyan-400 focus:border-cyan-400 focus:outline-none'
					rows='6'
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
				/>
				<input
					type='button'
					className={`hover:${
						disableSubmit ? "" : "bg-cyan-400"
					} drop-shadow-lg hover:${
						disableSubmit ? "" : "cursor-pointer"
					} px-5 py-2 text-white font-bold rounded-2xl bg-cyan-700 focus:border-cyan-400 focus:outline-cyan-400`}
					value='SUBMIT'
					onClick={handleSubmit}
					disabled={disableSubmit}
				></input>
				<p className='font-bold'>{tries} attempts left</p>
				<p
					className={
						tries === 0
							? "px-5 py-2 text-white font-bold rounded-2xl bg-cyan-700"
							: "hidden"
					}
				>
					NOTICE: you may now close this window to open a support ticket for
					your issue.
				</p>
				<button
					className={
						tries === 0
							? "drop-shadow-lg hover:bg-cyan-400 px-5 py-2 text-white font-bold rounded-2xl bg-cyan-700 focus:border-cyan-400 focus:outline-cyan-400"
							: "hidden"
					}
				>
					CLOSE
				</button>
				<h3 className='text-lg mr-auto'>Answer:</h3>
				<textarea
					className='box-border w-full resize-none border-2 rounded border-solid border-cyan-700'
					rows='6'
					disabled
					value={answer}
				/>
				<button
					className='mr-auto'
					onClick={() => setToggleSymbol(!toggleSymbol)}
				>
					View Answer History {(toggleSymbol && "-") || "+"}
				</button>
				<div className={toggleSymbol ? "mr-auto" : "hidden"}>
					{history &&
						history.map((item, indx) => (
							<div key={indx} className='text-left'>
								<p>
									Prompt {indx + 1} {item.prompt}
								</p>
								<p>
									Answer {indx + 1} {item.answer}
								</p>
							</div>
						))}
				</div>
			</div>
		</div>
	)
}

export default App
