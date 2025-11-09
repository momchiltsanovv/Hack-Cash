//
// const router = express.Router();
//
// const scenarios = [
//   {
//     id: 1,
//     difficulty: "easy",
//     text: "You're grabbing a drink 🥤",
//     options: [
//       { choice: "Water bottle (practical)", reward: 3 },
//       { choice: "Brand-name iced drink", reward: 1 }
//     ]
//   },
//   {
//     id: 2,
//     difficulty: "easy",
//     text: "Quick snack 🍪",
//     options: [
//       { choice: "Homemade snack", reward: 3 },
//       { choice: "Cafe pastry", reward: 1 }
//     ]
//   },
//   {
//     id: 3,
//     difficulty: "medium",
//     text: "You need bread 🍞",
//     options: [
//       { choice: "Neighborhood bakery", reward: 6 },
//       { choice: "Trendy boutique bakery", reward: 3 }
//     ]
//   },
//   {
//     id: 4,
//     difficulty: "medium",
//     text: "Coffee break ☕",
//     options: [
//       { choice: "Basic espresso bar", reward: 6 },
//       { choice: "Latte-art café", reward: 3 }
//     ]
//   },
//   {
//     id: 5,
//     difficulty: "medium",
//     text: "Lunch time 🍲",
//     options: [
//       { choice: "Cook / meal prep", reward: 7 },
//       { choice: "Restaurant lunch", reward: 3 }
//     ]
//   },
//   {
//     id: 6,
//     difficulty: "hard",
//     text: "Grocery shopping 🥦",
//     options: [
//       { choice: "Plan + buy essentials only", reward: 10 },
//       { choice: "Buy everything that looks nice", reward: 4 }
//     ]
//   },
//   {
//     id: 7,
//     difficulty: "hard",
//     text: "Gift shopping 🎁",
//     options: [
//       { choice: "Thoughtful handmade gift", reward: 10 },
//       { choice: "High-end commercial gift", reward: 4 }
//     ]
//   },
//   {
//     id: 8,
//     difficulty: "boss",
//     text: "Weekend outing 🌇",
//     options: [
//       { choice: "Picnic, games, walks", reward: 15 },
//       { choice: "Rooftop cocktail night", reward: 5 }
//     ]
//   }
// ];
//
// // Get scenario by level number
// router.get("/level/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   res.json(scenarios[id - 1]);
// });
//
// router.post("/choose", (req, res) => {
//   const { scenarioId, choice } = req.body;
//   const scenario = scenarios.find(s => s.id === scenarioId);
//   const selected = scenario.options.find(o => o.choice === choice);
//
//   res.json({
//     reward: selected.reward,
//     message: `+${selected.reward} coins`
//   });
// });
//
// export default router;