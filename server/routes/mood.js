const express = require('express');
const router = express.Router();

// Mood quotes based on mood type
const moodQuotes = {
  happy: [
    "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
    "The purpose of our lives is to be happy. - Dalai Lama",
    "Happiness is a choice, not a result. Nothing will make you happy until you choose to be happy.",
    "Be happy for this moment. This moment is your life.",
    "The secret of happiness is to find a congenial work. - Pearl S. Buck"
  ],
  sad: [
    "The way I see it, if you want the rainbow, you gotta put up with the rain. - Dolly Parton",
    "Every storm runs out of rain. - Maya Angelou",
    "Tough times never last, but tough people do. - Robert H. Schuller",
    "You are not alone. You are seen. You are heard. You are loved.",
    "This too shall pass. Everything will be okay in the end. If it's not okay, it's not the end."
  ],
  anxious: [
    "Anxiety is a thin stream of fear trickling through the mind. If encouraged, it cuts a channel into which all other thoughts are drained. - Arthur Somers Roche",
    "You don't have to control your thoughts. You just have to stop letting them control you.",
    "Worrying doesn't take away tomorrow's troubles, it takes away today's peace.",
    "Breathe. It's just a bad day, not a bad life.",
    "You've survived 100% of your worst days. You're doing great."
  ],
  angry: [
    "For every minute you remain angry, you give up sixty seconds of peace of mind. - Ralph Waldo Emerson",
    "Anger is an acid that can do more harm to the vessel in which it is stored than to anything on which it is poured. - Mark Twain",
    "Holding onto anger is like grasping a hot coal with the intent of throwing it at someone else; you are the one who gets burned. - Buddha",
    "When angry, count to ten before you speak. If very angry, count to one hundred. - Thomas Jefferson",
    "Peace cannot be kept by force; it can only be achieved by understanding. - Albert Einstein"
  ],
  stressed: [
    "It's not the load that breaks you down, it's the way you carry it. - Lou Holtz",
    "Stress is caused by being 'here' but wanting to be 'there'. - Eckhart Tolle",
    "Take a deep breath. It's just a bad moment, not a bad life.",
    "You can't calm the storm, so stop trying. What you can do is calm yourself. The storm will pass.",
    "The greatest weapon against stress is our ability to choose one thought over another. - William James"
  ],
  neutral: [
    "Life is what happens to you while you're busy making other plans. - John Lennon",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "In the middle of difficulty lies opportunity. - Albert Einstein",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius"
  ]
};

// Yoga and exercise postures
const exercises = {
  happy: [
    { name: "Sun Salutation", description: "A series of 12 yoga poses performed in a graceful flow to energize the body.", duration: "5-10 minutes" },
    { name: "Warrior Pose", description: "Stand strong and confident, building inner strength and stability.", duration: "30 seconds each side" },
    { name: "Dancing", description: "Put on your favorite music and dance freely to express joy.", duration: "10-15 minutes" }
  ],
  sad: [
    { name: "Child's Pose", description: "A calming pose that helps release tension and promotes relaxation.", duration: "2-5 minutes" },
    { name: "Legs Up the Wall", description: "Lie down with legs up against a wall to calm the nervous system.", duration: "5-10 minutes" },
    { name: "Gentle Walking", description: "Take a slow walk in nature to help lift your mood.", duration: "20-30 minutes" }
  ],
  anxious: [
    { name: "Deep Breathing", description: "Inhale for 4 counts, hold for 4, exhale for 4. Repeat 10 times.", duration: "5 minutes" },
    { name: "Cat-Cow Pose", description: "Gentle spinal movement that helps release tension and anxiety.", duration: "2-3 minutes" },
    { name: "Meditation", description: "Sit quietly and focus on your breath, letting thoughts pass without judgment.", duration: "10-20 minutes" }
  ],
  angry: [
    { name: "Power Yoga Flow", description: "Vigorous yoga sequences to release pent-up energy and anger.", duration: "20-30 minutes" },
    { name: "Boxing or Punching Bag", description: "Physical activity to release anger in a healthy way.", duration: "15-20 minutes" },
    { name: "Running", description: "Cardio exercise to help process and release anger.", duration: "20-30 minutes" }
  ],
  stressed: [
    { name: "Yoga Nidra", description: "A guided relaxation practice that deeply relaxes body and mind.", duration: "20-30 minutes" },
    { name: "Neck and Shoulder Stretches", description: "Release tension from common stress areas.", duration: "5-10 minutes" },
    { name: "Progressive Muscle Relaxation", description: "Tense and release each muscle group to reduce stress.", duration: "15-20 minutes" }
  ],
  neutral: [
    { name: "Full Body Stretch", description: "Gentle stretching to maintain flexibility and well-being.", duration: "10-15 minutes" },
    { name: "Balanced Yoga Flow", description: "A moderate yoga practice to maintain physical and mental balance.", duration: "20-30 minutes" },
    { name: "Walking Meditation", description: "Mindful walking to stay present and grounded.", duration: "15-20 minutes" }
  ]
};

// Get quotes for a mood
router.get('/quotes/:mood', (req, res) => {
  const { mood } = req.params;
  const moodLower = mood.toLowerCase();

  if (!moodQuotes[moodLower]) {
    return res.status(400).json({ error: 'Invalid mood type' });
  }

  const quotes = moodQuotes[moodLower];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  res.json({ quote: randomQuote, mood: moodLower });
});

// Get exercises for a mood
router.get('/exercises/:mood', (req, res) => {
  const { mood } = req.params;
  const moodLower = mood.toLowerCase();

  if (!exercises[moodLower]) {
    return res.status(400).json({ error: 'Invalid mood type' });
  }

  res.json({ exercises: exercises[moodLower], mood: moodLower });
});

// Get all mood data
router.get('/all/:mood', (req, res) => {
  const { mood } = req.params;
  const moodLower = mood.toLowerCase();

  if (!moodQuotes[moodLower] || !exercises[moodLower]) {
    return res.status(400).json({ error: 'Invalid mood type' });
  }

  const quotes = moodQuotes[moodLower];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  res.json({
    mood: moodLower,
    quote: randomQuote,
    exercises: exercises[moodLower]
  });
});

module.exports = router;

