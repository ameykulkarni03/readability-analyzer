document.getElementById('analyzeButton').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: getTextFromPage
      }, (injectionResults) => {
          if (injectionResults && injectionResults[0]) {
              const text = injectionResults[0].result;
              const results = {
                  readingEase: calculateFleschKincaidReadingEase(text).toFixed(2),
                  gradeLevel: calculateFleschKincaidGradeLevel(text).toFixed(2)
              };
              document.getElementById('results').innerText = `Reading Ease: ${results.readingEase}
                                                             Grade Level: ${results.gradeLevel}`;
          }
      });
  });
});

function getTextFromPage() {
  return document.body.innerText;
}

function calculateFleschKincaidReadingEase(text) {
  const totalSentences = text.split(/[.!?]+/).length;
  const totalWords = text.split(/\s+/).length;
  const totalSyllables = countTotalSyllables(text);
  return 206.835 - 1.015 * (totalWords / totalSentences) - 84.6 * (totalSyllables / totalWords);
}

function calculateFleschKincaidGradeLevel(text) {
  const totalSentences = text.split(/[.!?]+/).length;
  const totalWords = text.split(/\s+/).length;
  const totalSyllables = countTotalSyllables(text);
  return 0.39 * (totalWords / totalSentences) + 11.8 * (totalSyllables / totalWords) - 15.59;
}

function countTotalSyllables(text) {
  const words = text.split(/\s+/);
  return words.reduce((total, word) => total + countSyllables(word), 0);
}

function countSyllables(word) {
  let syllables = 0;
  const vowels = "aeiouy";
  if (vowels.indexOf(word[0]) > -1) syllables++;
  for (let i = 1; i < word.length; i++) {
      if (vowels.indexOf(word[i]) > -1 && vowels.indexOf(word[i - 1]) === -1) syllables++;
  }
  if (word.endsWith("e")) syllables--;
  return syllables > 0 ? syllables : 1;
}
