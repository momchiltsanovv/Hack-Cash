//
// const router = express.Router();
//
// // Emoji set (8 pairs = 16 cards total)
// const cards = ["💰", "💎", "🪙", "📈", "💳", "💵", "🛍️", "🏦"];
//
// function shuffle(array) {
//   return [...array].sort(() => Math.random() - 0.5);
// }
//
// router.post("/start", (req, res) => {
//   const { userId } = req.body;
//   const deck = shuffle([...cards, ...cards]);
//
//   sessions[userId] = {
//     deck,
//     matched: [],
//     coinsEarned: 0,
//     tries: 0 // <-- ✅ ensure tries is initialized
//   };
//
//   res.json({
//     status: "ok",
//     deck,
//     coins: 0,
//     tries: 0 // <-- ✅ explicitly return this
//   });
// });
//
// // Check match
// router.post("/check", (req, res) => {
//   const { userId, index1, index2 } = req.body;
//   const session = sessions[userId];
//
//   session.tries++; // Increase attempts every time two cards are checked
//
//   const card1 = session.deck[index1];
//   const card2 = session.deck[index2];
//
//   if (card1 === card2) {
//     // Reward curve: good play = more rewards
//     const reward = session.tries <= 12 ? 5 : 1;
//
//     session.matched.push(card1);
//     session.coinsEarned += reward;
//
//     return res.json({
//       match: true,
//       reward,
//       coins: session.coinsEarned,
//       tries: session.tries,
//       message: `Match! +${reward} coins`
//     });
//   }
//
//   return res.json({
//     match: false,
//     coins: session.coinsEarned,
//     tries: session.tries,
//     message: "No match."
//   });
// });
//
// // Results
// router.get("/results/:userId", (req, res) => {
//   const { userId } = req.params;
//   const session = sessions[userId];
//
//   res.json({
//     coins: session.coinsEarned,
//     tries: session.tries,
//     finished: session.matched.length === cards.length
//   });
// });
//
// export default router;