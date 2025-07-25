// import { BGPattern } from '../../components/ui/BGPattern.jsx';
// import { Navbar } from '../../components/home/Navbar.jsx';
// import { useState, useEffect } from "react"
//
// export default function MatchingQuestion({ onTypeChange, onBack }) {
//     const [selectedLevel, setSelectedLevel] = useState(1)
//     const [timeLimit, setTimeLimit] = useState(30)
//     const [question, setQuestion] = useState("")
//     const [leftItems, setLeftItems] = useState([
//         { id: 1, text: "" },
//         { id: 2, text: "" },
//     ])
//     const [rightItems, setRightItems] = useState([
//         { id: 1, text: "" },
//         { id: 2, text: "" },
//         { id: 3, text: "" },
//         { id: 4, text: "" },
//     ])
//     const [connections, setConnections] = useState([])
//     const [draggedItem, setDraggedItem] = useState(null)
//     const [draggedSide, setDraggedSide] = useState(null)
//
//     const questionTypes = [
//         { id: "single-choice", name: "Single Choice" },
//         { id: "multi-choice", name: "Multi Choice" },
//         { id: "matching", name: "Matching" },
//         { id: "fill-in", name: "Fill In" },
//     ]
//
//     const handleLeftItemChange = (id, text) => {
//         setLeftItems(leftItems.map((item) => (item.id === id ? { ...item, text } : item)))
//     }
//
//     const handleRightItemChange = (id, text) => {
//         setRightItems(rightItems.map((item) => (item.id === id ? { ...item, text } : item)))
//     }
//
//     const addLeftItem = () => {
//         const newId = Math.max(...leftItems.map((item) => item.id)) + 1
//         setLeftItems([...leftItems, { id: newId, text: "" }])
//     }
//
//     const addRightItem = () => {
//         const newId = Math.max(...rightItems.map((item) => item.id)) + 1
//         setRightItems([...rightItems, { id: newId, text: "" }])
//     }
//
//     const removeLeftItem = (id) => {
//         if (leftItems.length > 1) {
//             setLeftItems(leftItems.filter((item) => item.id !== id))
//             setConnections(connections.filter((conn) => conn.leftId !== id))
//         }
//     }
//
//     const removeRightItem = (id) => {
//         if (rightItems.length > 1) {
//             setRightItems(rightItems.filter((item) => item.id !== id))
//             setConnections(connections.filter((conn) => conn.rightId !== id))
//         }
//     }
//
//     const handleDragStart = (item, side) => {
//         setDraggedItem(item)
//         setDraggedSide(side)
//     }
//
//     const handleDrop = (targetItem, targetSide) => {
//         if (!draggedItem || draggedSide === targetSide) return
//
//         const newConnection = {
//             leftId: draggedSide === "left" ? draggedItem.id : targetItem.id,
//             rightId: draggedSide === "right" ? draggedItem.id : targetItem.id,
//         }
//
//         // Remove existing connections for these items
//         const filteredConnections = connections.filter(
//             (conn) => conn.leftId !== newConnection.leftId && conn.rightId !== newConnection.rightId,
//         )
//
//         setConnections([...filteredConnections, newConnection])
//         setDraggedItem(null)
//         setDraggedSide(null)
//     }
//
//     const removeConnection = (leftId, rightId) => {
//         setConnections(connections.filter((conn) => !(conn.leftId === leftId && conn.rightId === rightId)))
//     }
//
//     return (
//         <div className="min-h-screen bg-[#0D0D0D] text-white">
//             <BGPattern variant="dots" mask="fade-edges" fill="#444444" size={32} />
//             <Navbar />
//
//             <div className="relative z-10 flex items-center justify-center min-h-screen py-16">
//                 {/* Left Sidebar */}
//                 <div className="w-80 p-6 border-r border-[#444444]">
//                     <div className="space-y-6">
//                         <div className="flex gap-3">
//                             <button
//                                 onClick={onBack}
//                                 className="px-6 py-2 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full text-white font-medium hover:shadow-lg transition-all"
//                             >
//                                 Bắt đầu
//                             </button>
//                             <button className="px-6 py-2 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full text-white font-medium hover:shadow-lg transition-all">
//                                 thêm câu hỏi
//                             </button>
//                         </div>
//
//                         <div className="space-y-4">
//                             <div>
//                                 <label className="block text-[#CCCCCC] text-sm mb-2">Quiz Name</label>
//                                 <input
//                                     type="text"
//                                     placeholder="quizname."
//                                     className="w-full p-3 bg-[#1A1A1A] border border-[#666666] rounded-lg text-[#F5F5F5] placeholder-[#888888] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="block text-[#CCCCCC] text-sm mb-2">Description</label>
//                                 <textarea
//                                     placeholder="description."
//                                     className="w-full p-3 bg-[#1A1A1A] border border-[#666666] rounded-lg text-[#F5F5F5] placeholder-[#888888] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none resize-none h-20"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="block text-[#CCCCCC] text-sm mb-2">Code</label>
//                                 <input
//                                     type="text"
//                                     placeholder="code."
//                                     className="w-full p-3 bg-[#1A1A1A] border border-[#666666] rounded-lg text-[#F5F5F5] placeholder-[#888888] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
//                                 />
//                             </div>
//
//                             <div>
//                                 <label className="block text-[#CCCCCC] text-sm mb-2">Visibility</label>
//                                 <select className="w-full p-3 bg-[#1A1A1A] border border-[#666666] rounded-lg text-[#F5F5F5] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none">
//                                     <option value="private">public/private (private)</option>
//                                     <option value="public">public</option>
//                                 </select>
//                             </div>
//
//                             <div>
//                                 <label className="block text-[#CCCCCC] text-sm mb-2">Topic</label>
//                                 <input
//                                     type="text"
//                                     placeholder="topic"
//                                     className="w-full p-3 bg-[#1A1A1A] border border-[#666666] rounded-lg text-[#F5F5F5] placeholder-[#888888] focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none"
//                                 />
//                             </div>
//
//                             <button className="px-6 py-2 bg-gradient-to-r from-[#DB2777] to-[#DC2626] rounded-full text-white font-medium hover:shadow-lg transition-all">
//                                 sửa
//                             </button>
//
//                             <div className="text-[#CCCCCC] text-sm">
//                                 <p>rằng buộc cột bên trái hoặc bên phải ít nhất 1 trong 2 phải full</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Main Content */}
//                 <div className="flex-1 p-6">
//                     <div className="max-w-6xl mx-auto">
//                         {/* Top Controls */}
//                         <div className="flex items-center gap-4 mb-6">
//                             <div className="flex items-center gap-2">
//                                 <span className="px-4 py-2 bg-[#F59E0B] rounded-lg text-black font-medium">level</span>
//                                 <span className="text-[#CCCCCC]">can change</span>
//                             </div>
//
//                             <div className="flex items-center gap-2">
//                                 <button
//                                     onClick={() => setSelectedLevel(Math.max(1, selectedLevel - 1))}
//                                     className="w-8 h-8 bg-[#DC2626] rounded text-white font-bold hover:bg-[#B91C1C] transition-colors"
//                                 >
//                                     -
//                                 </button>
//                                 <span className="text-[#F5F5F5] font-bold text-xl min-w-[2rem] text-center">{selectedLevel}</span>
//                                 <button
//                                     onClick={() => setSelectedLevel(Math.min(5, selectedLevel + 1))}
//                                     className="w-8 h-8 bg-[#2563EB] rounded text-white font-bold hover:bg-[#1D4ED8] transition-colors"
//                                 >
//                                     +
//                                 </button>
//                                 <span className="text-[#CCCCCC] ml-2">point</span>
//                             </div>
//
//                             <div className="flex items-center gap-2">
//                                 <select
//                                     value="matching"
//                                     onChange={(e) => onTypeChange(e.target.value)}
//                                     className="px-4 py-2 bg-[#F59E0B] rounded-lg text-black font-medium focus:outline-none"
//                                 >
//                                     {questionTypes.map((type) => (
//                                         <option key={type.id} value={type.id}>
//                                             {type.name}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <span className="text-[#CCCCCC]">can change</span>
//                             </div>
//
//                             <div className="flex items-center gap-2">
//                                 <span className="px-4 py-2 bg-[#9333EA] rounded-lg text-white font-medium">matching</span>
//                                 <span className="px-4 py-2 bg-[#9333EA] rounded-lg text-white font-medium">multi choice</span>
//                             </div>
//                         </div>
//
//                         {/* Matching Interface */}
//                         <div className="relative">
//                             <div className="grid grid-cols-2 gap-8 mb-6">
//                                 {/* Left Column */}
//                                 <div className="space-y-4">
//                                     {leftItems.map((item, index) => (
//                                         <div
//                                             key={item.id}
//                                             className="relative"
//                                             draggable
//                                             onDragStart={() => handleDragStart(item, "left")}
//                                             onDragOver={(e) => e.preventDefault()}
//                                             onDrop={() => handleDrop(item, "left")}
//                                         >
//                                             <div className="bg-[#2563EB] rounded-lg p-4 cursor-move hover:bg-[#1D4ED8] transition-colors">
//                                                 <div className="flex items-center gap-3">
//                           <span className="w-8 h-8 bg-white rounded text-[#2563EB] font-bold flex items-center justify-center">
//                             {index + 1}
//                           </span>
//                                                     <input
//                                                         type="text"
//                                                         value={item.text}
//                                                         onChange={(e) => handleLeftItemChange(item.id, e.target.value)}
//                                                         placeholder={`Left item ${index + 1}`}
//                                                         className="flex-1 bg-transparent text-white placeholder-white/70 outline-none"
//                                                         onClick={(e) => e.stopPropagation()}
//                                                     />
//                                                     {leftItems.length > 1 && (
//                                                         <button
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation()
//                                                                 removeLeftItem(item.id)
//                                                             }}
//                                                             className="w-6 h-6 bg-white/20 rounded text-white hover:bg-white/30 transition-colors flex items-center justify-center"
//                                                         >
//                                                             ×
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//
//                                     <button
//                                         onClick={addLeftItem}
//                                         className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//
//                                 {/* Right Column */}
//                                 <div className="space-y-4">
//                                     {rightItems.map((item, index) => (
//                                         <div
//                                             key={item.id}
//                                             className="relative"
//                                             draggable
//                                             onDragStart={() => handleDragStart(item, "right")}
//                                             onDragOver={(e) => e.preventDefault()}
//                                             onDrop={() => handleDrop(item, "right")}
//                                         >
//                                             <div
//                                                 className={`rounded-lg p-4 cursor-move transition-colors ${
//                                                     index % 2 === 0 ? "bg-[#2563EB] hover:bg-[#1D4ED8]" : "bg-[#FF8C42] hover:bg-[#E07B39]"
//                                                 }`}
//                                             >
//                                                 <div className="flex items-center gap-3">
//                           <span className="w-8 h-8 bg-white rounded text-black font-bold flex items-center justify-center">
//                             {index + 1}
//                           </span>
//                                                     <input
//                                                         type="text"
//                                                         value={item.text}
//                                                         onChange={(e) => handleRightItemChange(item.id, e.target.value)}
//                                                         placeholder={`Right item ${index + 1}`}
//                                                         className="flex-1 bg-transparent text-white placeholder-white/70 outline-none"
//                                                         onClick={(e) => e.stopPropagation()}
//                                                     />
//                                                     {rightItems.length > 1 && (
//                                                         <button
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation()
//                                                                 removeRightItem(item.id)
//                                                             }}
//                                                             className="w-6 h-6 bg-white/20 rounded text-white hover:bg-white/30 transition-colors flex items-center justify-center"
//                                                         >
//                                                             ×
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//
//                                     <button
//                                         onClick={addRightItem}
//                                         className="w-16 h-16 bg-[#84CC16] rounded-lg flex items-center justify-center text-white text-2xl hover:bg-[#65A30D] transition-colors"
//                                     >
//                                         +
//                                     </button>
//                                 </div>
//                             </div>
//
//                             {/* Connection Lines */}
//                             <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
//                                 {connections.map((connection, index) => {
//                                     const leftIndex = leftItems.findIndex((item) => item.id === connection.leftId)
//                                     const rightIndex = rightItems.findIndex((item) => item.id === connection.rightId)
//
//                                     if (leftIndex === -1 || rightIndex === -1) return null
//
//                                     const leftY = leftIndex * 80 + 40
//                                     const rightY = rightIndex * 80 + 40
//
//                                     return (
//                                         <g key={index}>
//                                             <line
//                                                 x1="45%"
//                                                 y1={leftY}
//                                                 x2="55%"
//                                                 y2={rightY}
//                                                 stroke="black"
//                                                 strokeWidth="3"
//                                                 className="cursor-pointer"
//                                                 onClick={() => removeConnection(connection.leftId, connection.rightId)}
//                                             />
//                                         </g>
//                                     )
//                                 })}
//                             </svg>
//                         </div>
//
//                         {/* Time Slider */}
//                         <div className="mb-8">
//                             <div className="flex items-center justify-center gap-4">
//                                 <div className="flex-1 max-w-md">
//                                     <div className="relative">
//                                         {/* Custom Time Slider */}
//                                         <div className="relative bg-[#2A2A2A] h-12 rounded-lg border-2 border-[#9333EA] overflow-hidden">
//                                             {/* Ruler marks */}
//                                             <div className="absolute inset-0 flex items-center justify-center">
//                                                 {Array.from({ length: 30 }, (_, i) => (
//                                                     <div key={i} className="w-px bg-black h-8" style={{ marginRight: i < 29 ? "8px" : "0" }} />
//                                                 ))}
//                                             </div>
//
//                                             {/* Slider input */}
//                                             <input
//                                                 type="range"
//                                                 min="10"
//                                                 max="300"
//                                                 step="5"
//                                                 value={timeLimit}
//                                                 onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
//                                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                             />
//
//                                             {/* Slider thumb indicator */}
//                                             <div
//                                                 className="absolute top-1/2 transform -translate-y-1/2 w-4 h-8 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded pointer-events-none"
//                                                 style={{
//                                                     left: `${((timeLimit - 10) / (300 - 10)) * 100}%`,
//                                                     transform: "translateX(-50%) translateY(-50%)",
//                                                 }}
//                                             />
//                                         </div>
//
//                                         <div className="text-center mt-2">
//                                             <span className="text-[#F5F5F5] font-bold text-lg">{timeLimit}s</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//
//                         {/* Action Buttons */}
//                         <div className="flex justify-center gap-4">
//                             <button className="px-8 py-3 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] rounded-lg text-white font-medium hover:shadow-lg transition-all">
//                                 Xóa
//                             </button>
//                             <button className="px-8 py-3 bg-gradient-to-r from-[#9333EA] to-[#DB2777] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[rgba(219,39,119,0.3)] transition-all">
//                                 Ẩn
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
