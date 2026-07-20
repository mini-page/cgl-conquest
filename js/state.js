// === STATE & DATABASE MODULE ===
/* ==========================================================================
   Conquest Dashboard - Application Logic (Tailwind Core Edition)
   ========================================================================== */

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((reg) => console.log('Service Worker registered successfully!', reg.scope))
            .catch((err) => console.warn('Service Worker registration failed:', err));
    });
}

// 1. SYLLABUS DATABASE (INLINE COMPILED)
const SYLLABUS_DATA = [
  {
    "id": "q-1",
    "subject": "Quantitative Aptitude",
    "category": "Arithmetic",
    "topic": "Percentage",
    "subtopics": [
      {
        "id": "q-1-1",
        "name": "Basic Calculations & Fractions Conversion",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-1-2",
        "name": "Percentage Increase/Decrease & Successive changes",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-1-3",
        "name": "Product Constancy & Consumption-Price models",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-1-4",
        "name": "Income-Expenditure & Population word problems",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-1-5",
        "name": "Venn Diagram based Percentage questions",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "q-2",
    "subject": "Quantitative Aptitude",
    "category": "Arithmetic",
    "topic": "Ratio & Proportion",
    "subtopics": [
      {
        "id": "q-2-1",
        "name": "Basic Ratios, Combining & Balancing Ratios",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-2-2",
        "name": "Proportionals (Mean, Third, Fourth Proportion)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-2-3",
        "name": "Incomes, Expenses & Savings Ratio problems",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-2-4",
        "name": "Coins, Bag & Value distribution problems",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "q-3",
    "subject": "Quantitative Aptitude",
    "category": "Arithmetic",
    "topic": "Average",
    "subtopics": [
      {
        "id": "q-3-1",
        "name": "Basic Average & Consecutive Numbers properties",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "q-3-2",
        "name": "Weighted Average & Group changes (Replacement/Inclusion/Exclusion)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-3-3",
        "name": "Average Speed word problems",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "q-3-4",
        "name": "Advanced averages with variables (Error correction)",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "q-4",
    "subject": "Quantitative Aptitude",
    "category": "Arithmetic",
    "topic": "Profit & Loss",
    "subtopics": [
      {
        "id": "q-4-1",
        "name": "Basic Cost Price, Selling Price & Profit/Loss %",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-4-2",
        "name": "Marked Price, Discounts & Successive Discounts",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-4-3",
        "name": "Dishonest Dealer & Cheating weights models",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-4-4",
        "name": "SP of two articles same / CP same logic",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "q-5",
    "subject": "Quantitative Aptitude",
    "category": "Arithmetic",
    "topic": "Simple & Compound Interest",
    "subtopics": [
      {
        "id": "q-5-1",
        "name": "Simple Interest basics & Rate/Time relations",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "q-5-2",
        "name": "Compound Interest (Annual, Half-yearly, Quarterly)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-5-3",
        "name": "Difference between CI and SI (2 years & 3 years)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-5-4",
        "name": "SI and CI Installations models",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "High"
      }
    ]
  },
  {
    "id": "q-6",
    "subject": "Quantitative Aptitude",
    "category": "Arithmetic",
    "topic": "Time & Work",
    "subtopics": [
      {
        "id": "q-6-1",
        "name": "Basic Efficiency & Days calculations (LCM Method)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-6-2",
        "name": "Alternate Days working schedule",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-6-3",
        "name": "Men, Women, Boys efficiency ratio equation (MDH rule)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-6-4",
        "name": "Pipes & Cisterns (Inlet, Outlet, Leakages)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-6-5",
        "name": "Work & Wages division models",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "q-7",
    "subject": "Quantitative Aptitude",
    "category": "Arithmetic",
    "topic": "Time, Speed & Distance",
    "subtopics": [
      {
        "id": "q-7-1",
        "name": "Speed Conversions & Relative Speed concepts",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-7-2",
        "name": "Train Crossing (Pole, Platform, Other train)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-7-3",
        "name": "Boats & Streams (Upstream, Downstream)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-7-4",
        "name": "Linear Races & Circular Tracks",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "High"
      }
    ]
  },
  {
    "id": "q-8",
    "subject": "Quantitative Aptitude",
    "category": "Arithmetic",
    "topic": "Mixture & Alligation",
    "subtopics": [
      {
        "id": "q-8-1",
        "name": "Basic Alligation rule on price/weight",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "q-8-2",
        "name": "Replacement & Repeated dilution formula",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "High"
      },
      {
        "id": "q-8-3",
        "name": "Mixing of three or more containers",
        "difficulty": "Moderate",
        "weightage": "Low",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "q-9",
    "subject": "Quantitative Aptitude",
    "category": "Arithmetic",
    "topic": "Partnership",
    "subtopics": [
      {
        "id": "q-9-1",
        "name": "Simple Partnerships (Capital & Time ratio)",
        "difficulty": "Easy",
        "weightage": "Low",
        "effort": "Low"
      },
      {
        "id": "q-9-2",
        "name": "Active & Sleeping partners (Salaries distribution)",
        "difficulty": "Moderate",
        "weightage": "Low",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "q-10",
    "subject": "Quantitative Aptitude",
    "category": "Advanced Mathematics",
    "topic": "Number System",
    "subtopics": [
      {
        "id": "q-10-1",
        "name": "Classification of Numbers & Face/Place value",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "q-10-2",
        "name": "Divisibility Rules (Combined 7-11-13, 11, 72, 88)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-10-3",
        "name": "Unit Digit & Last Two Digits calculations",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "q-10-4",
        "name": "Remainder Theorems (Euler, Fermat, Wilson, Chinese)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "q-10-5",
        "name": "Factors (Sum, Product, Odd/Even factors count)",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "q-10-6",
        "name": "HCF & LCM word models & Bell ring problems",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "q-11",
    "subject": "Quantitative Aptitude",
    "category": "Advanced Mathematics",
    "topic": "Algebra",
    "subtopics": [
      {
        "id": "q-11-1",
        "name": "Algebraic Identities (Squares, Cubes, a3+b3+c3-3abc)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "q-11-2",
        "name": "x + 1/x type variations & transformations",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-11-3",
        "name": "Linear Equations & Graphs (Parallel, Coincident lines)",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "q-11-4",
        "name": "Quadratic Equations (Roots, Discriminants, Max/Min value)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      }
    ]
  },
  {
    "id": "q-12",
    "subject": "Quantitative Aptitude",
    "category": "Advanced Mathematics",
    "topic": "Geometry",
    "subtopics": [
      {
        "id": "q-12-1",
        "name": "Lines, Angles & Parallel lines properties",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "q-12-2",
        "name": "Triangles (Congruency, Similarity, Sine/Cosine rules)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "q-12-3",
        "name": "Triangle Centers (Incenter, Orthocenter, Centroid, Circumcenter)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "q-12-4",
        "name": "Circles (Chords, Tangents, Secants theorems)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "q-12-5",
        "name": "Polygons (Sum of Interior/Exterior angles, Diagonals)",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "q-13",
    "subject": "Quantitative Aptitude",
    "category": "Advanced Mathematics",
    "topic": "Mensuration (2D & 3D)",
    "subtopics": [
      {
        "id": "q-13-1",
        "name": "2D Area & Perimeter (Triangle, Quadrilaterals, Circle)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-13-2",
        "name": "3D Cuboid, Cube, Cylinder, Cone (Surface Area & Volume)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "q-13-3",
        "name": "Spheres & Hemispheres (Melting & Recasting)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-13-4",
        "name": "Prism & Pyramid (Hexagonal, Triangular bases)",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "High"
      },
      {
        "id": "q-13-5",
        "name": "Frustum of Cone (Tier 2 Focus)",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "High"
      }
    ]
  },
  {
    "id": "q-14",
    "subject": "Quantitative Aptitude",
    "category": "Advanced Mathematics",
    "topic": "Trigonometry",
    "subtopics": [
      {
        "id": "q-14-1",
        "name": "Trigonometric Ratios & Value Chart (0-90 degrees)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-14-2",
        "name": "Trigonometric Identities & Complementary Angles",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "q-14-3",
        "name": "Maximum & Minimum values of Trig expressions",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "q-14-4",
        "name": "Heights & Distances (Angle of Elevation/Depression)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "q-15",
    "subject": "Quantitative Aptitude",
    "category": "Advanced Mathematics",
    "topic": "Statistics & Probability",
    "subtopics": [
      {
        "id": "q-15-1",
        "name": "Mean, Median, Mode & Standard Deviation",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-15-2",
        "name": "Basic Probability (Coins, Dice, Cards)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "q-15-3",
        "name": "Conditional Probability & Multiplication theorem",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "High"
      }
    ]
  },
  {
    "id": "q-16",
    "subject": "Quantitative Aptitude",
    "category": "Advanced Mathematics",
    "topic": "Data Interpretation",
    "subtopics": [
      {
        "id": "q-16-1",
        "name": "Bar Graph, Line Graph analysis",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-16-2",
        "name": "Pie Chart (Degree & Percent distributions)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "q-16-3",
        "name": "Histogram & Frequency Polygon",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "r-1",
    "subject": "General Intelligence & Reasoning",
    "category": "Verbal Reasoning",
    "topic": "Coding-Decoding",
    "subtopics": [
      {
        "id": "r-1-1",
        "name": "Letter-to-Letter Coding (Place values & Opposites)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "r-1-2",
        "name": "Letter-to-Number & Mixed Chinese Coding",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "r-1-3",
        "name": "Advanced Logical pattern codings",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "r-2",
    "subject": "General Intelligence & Reasoning",
    "category": "Verbal Reasoning",
    "topic": "Analogy & Classification",
    "subtopics": [
      {
        "id": "r-2-1",
        "name": "Word/GK based Analogy & Odd One Out",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "r-2-2",
        "name": "Number & Alphabet Set-Analogies (Tough patterns)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "r-3",
    "subject": "General Intelligence & Reasoning",
    "category": "Verbal Reasoning",
    "topic": "Series (Number & Alphabet)",
    "subtopics": [
      {
        "id": "r-3-1",
        "name": "Alphanumeric & Continuous Pattern Series",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "r-3-2",
        "name": "Missing Number Series (Double diff, Squares/Cubes)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "r-3-3",
        "name": "Wrong Number Series identification",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "r-4",
    "subject": "General Intelligence & Reasoning",
    "category": "Verbal Reasoning",
    "topic": "Blood Relations",
    "subtopics": [
      {
        "id": "r-4-1",
        "name": "Family Tree & Direct Pointer relations",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "r-4-2",
        "name": "Coded Blood Relations (A+B means A is father)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "r-5",
    "subject": "General Intelligence & Reasoning",
    "category": "Verbal Reasoning",
    "topic": "Direction Sense",
    "subtopics": [
      {
        "id": "r-5-1",
        "name": "Basic Directions & Pythagoras Theorem turns",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "r-5-2",
        "name": "Shadow-based directions & Angle turns",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "r-6",
    "subject": "General Intelligence & Reasoning",
    "category": "Verbal Reasoning",
    "topic": "Order & Ranking",
    "subtopics": [
      {
        "id": "r-6-1",
        "name": "Row position calculations & Interchanging positions",
        "difficulty": "Easy",
        "weightage": "Low",
        "effort": "Low"
      },
      {
        "id": "r-6-2",
        "name": "Comparison puzzles (A is taller than B...)",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "r-7",
    "subject": "General Intelligence & Reasoning",
    "category": "Verbal Reasoning",
    "topic": "Syllogism",
    "subtopics": [
      {
        "id": "r-7-1",
        "name": "Basic Venn Diagram (Some/All/No cases)",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "r-7-2",
        "name": "Possibility cases & Either-Or conditions",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "r-7-3",
        "name": "Only / Few / Only a few advanced Syllogisms",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "r-8",
    "subject": "General Intelligence & Reasoning",
    "category": "Verbal Reasoning",
    "topic": "Seating Arrangement & Puzzles",
    "subtopics": [
      {
        "id": "r-8-1",
        "name": "Linear & Circular seating (Facing inside/outside)",
        "difficulty": "Moderate",
        "weightage": "Low",
        "effort": "Moderate"
      },
      {
        "id": "r-8-2",
        "name": "Matrix/Grid based puzzle puzzles",
        "difficulty": "Hard",
        "weightage": "Low",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "r-9",
    "subject": "General Intelligence & Reasoning",
    "category": "Verbal Reasoning",
    "topic": "Data Sufficiency",
    "subtopics": [
      {
        "id": "r-9-1",
        "name": "Data sufficiency using Reasoning principles",
        "difficulty": "Hard",
        "weightage": "Low",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "r-10",
    "subject": "General Intelligence & Reasoning",
    "category": "Non-Verbal Reasoning",
    "topic": "Paper Folding & Cutting",
    "subtopics": [
      {
        "id": "r-10-1",
        "name": "Visualizing unfolded paper patterns",
        "difficulty": "Easy",
        "weightage": "Low",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "r-11",
    "subject": "General Intelligence & Reasoning",
    "category": "Non-Verbal Reasoning",
    "topic": "Mirror & Water Images",
    "subtopics": [
      {
        "id": "r-11-1",
        "name": "Alphabet & Figure reflective images",
        "difficulty": "Easy",
        "weightage": "Low",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "r-12",
    "subject": "General Intelligence & Reasoning",
    "category": "Non-Verbal Reasoning",
    "topic": "Embedded Figures & Completion",
    "subtopics": [
      {
        "id": "r-12-1",
        "name": "Finding embedded figures & completing designs",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "r-13",
    "subject": "General Intelligence & Reasoning",
    "category": "Non-Verbal Reasoning",
    "topic": "Figure Series & Matrix",
    "subtopics": [
      {
        "id": "r-13-1",
        "name": "Rotational series & element shifts patterns",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "r-13-2",
        "name": "Dice (Standard, Open Dice opposites properties)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "e-1",
    "subject": "English Language & Comprehension",
    "category": "Grammar",
    "topic": "Parts of Speech",
    "subtopics": [
      {
        "id": "e-1-1",
        "name": "Nouns & Pronouns Rules",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "e-1-2",
        "name": "Subject-Verb Agreement (Concord)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "e-1-3",
        "name": "Adjectives & Adverbs positioning rules",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "e-1-4",
        "name": "Prepositions usage & Fixed Prepositions (Tough)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "e-1-5",
        "name": "Conjunctions & Conditional Sentences",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "e-2",
    "subject": "English Language & Comprehension",
    "category": "Grammar",
    "topic": "Active & Passive Voice",
    "subtopics": [
      {
        "id": "e-2-1",
        "name": "Tense changes & Auxiliary verbs transitions",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "e-2-2",
        "name": "Imperative, Interrogative & Infinitive Voice shifts",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "e-3",
    "subject": "English Language & Comprehension",
    "category": "Grammar",
    "topic": "Direct & Indirect Speech",
    "subtopics": [
      {
        "id": "e-3-1",
        "name": "Assertive sentences, Tense & Time conversion rules",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "e-3-2",
        "name": "Exclamatory, Optative & Coded sentence conversions",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "e-4",
    "subject": "English Language & Comprehension",
    "category": "Grammar",
    "topic": "Error Spotting & Improvement",
    "subtopics": [
      {
        "id": "e-4-1",
        "name": "Noun/Pronoun/Verb Spotting drills",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "e-4-2",
        "name": "Modifier, Dangling Participle, Parallelism errors",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "e-5",
    "subject": "English Language & Comprehension",
    "category": "Vocabulary",
    "topic": "Vocabulary Drills",
    "subtopics": [
      {
        "id": "e-5-1",
        "name": "Synonyms & Antonyms (High frequency wordlists)",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "e-5-2",
        "name": "Idioms & Phrases (Origins & applications)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "e-5-3",
        "name": "One-word Substitutions lists",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "e-5-4",
        "name": "Spelling Correction & Homophones tricks",
        "difficulty": "Easy",
        "weightage": "Low",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "e-6",
    "subject": "English Language & Comprehension",
    "category": "Reading Comprehension",
    "topic": "Reading Comprehension Passages",
    "subtopics": [
      {
        "id": "e-6-1",
        "name": "Direct Fact retrieval & Vocabulary contextual clues",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "e-6-2",
        "name": "Inference-based, Tone & Central Theme questions",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      }
    ]
  },
  {
    "id": "e-7",
    "subject": "English Language & Comprehension",
    "category": "Reading Comprehension",
    "topic": "Cloze Test",
    "subtopics": [
      {
        "id": "e-7-1",
        "name": "Grammar-based blanks matching",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "e-7-2",
        "name": "Contextual vocabulary & Collocations fit",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      }
    ]
  },
  {
    "id": "e-8",
    "subject": "English Language & Comprehension",
    "category": "Reading Comprehension",
    "topic": "Para-jumbles",
    "subtopics": [
      {
        "id": "e-8-1",
        "name": "Finding opening/concluding sentences",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "e-8-2",
        "name": "Mandatory Pairs & Pronoun link methods",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      }
    ]
  },
  {
    "id": "a-1",
    "subject": "General Awareness",
    "category": "Static GK",
    "topic": "History",
    "subtopics": [
      {
        "id": "a-1-1",
        "name": "Ancient History (Harappan, Vedic, Buddhism & Mauryas)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "a-1-2",
        "name": "Medieval History (Delhi Sultanate, Mughals, Vijayanagara)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "a-1-3",
        "name": "Modern History (Marathas, British expansion, Congress, Gandhi Era)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      }
    ]
  },
  {
    "id": "a-2",
    "subject": "General Awareness",
    "category": "Static GK",
    "topic": "Geography",
    "subtopics": [
      {
        "id": "a-2-1",
        "name": "Indian Physical Geography (Borders, Himalayas, Rivers & Dams)",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "High"
      },
      {
        "id": "a-2-2",
        "name": "World Physical Geography (Solar system, Oceans, Atmosphere, Deserts)",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "High"
      },
      {
        "id": "a-2-3",
        "name": "Economic & Human Geography (Crops, Minerals, Census 2011)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "a-3",
    "subject": "General Awareness",
    "category": "Static GK",
    "topic": "Indian Polity & Constitution",
    "subtopics": [
      {
        "id": "a-3-1",
        "name": "Making of Constitution, Sources, Schedules & Parts",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-3-2",
        "name": "Fundamental Rights, Duties & DPSP (Art 12-51A)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-3-3",
        "name": "President, Parliament, State Legislature & Local Govts",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "a-3-4",
        "name": "Judiciary & Constitutional Bodies (CAG, Election Comm, UPSC)",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "a-4",
    "subject": "General Awareness",
    "category": "Static GK",
    "topic": "Economics",
    "subtopics": [
      {
        "id": "a-4-1",
        "name": "Introduction to Economics, Demand-Supply, Elasticity",
        "difficulty": "Moderate",
        "weightage": "Low",
        "effort": "Moderate"
      },
      {
        "id": "a-4-2",
        "name": "Macroeconomics (Inflation, GDP/National Income, Five Year Plans)",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "a-4-3",
        "name": "Banking & Financial Sector (RBI, Repo Rate, Mon Policy, Budget)",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "a-5",
    "subject": "General Awareness",
    "category": "Static GK",
    "topic": "Art & Culture",
    "subtopics": [
      {
        "id": "a-5-1",
        "name": "Indian Classical Dances, Folk Dances & Famous Artists",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "a-5-2",
        "name": "Festivals, Fair, Fairs & Folk Music",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "a-5-3",
        "name": "UNESCO World Heritage sites, Temples & Architecture styles",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "a-6",
    "subject": "General Awareness",
    "category": "Science",
    "topic": "Physics",
    "subtopics": [
      {
        "id": "a-6-1",
        "name": "Units, Dimensions & Motion mechanics",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "a-6-2",
        "name": "Work, Energy, Power & Gravity rules",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "a-6-3",
        "name": "Optics (Refraction, Lenses), Wave motion, Sound & Electricity",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "a-7",
    "subject": "General Awareness",
    "category": "Science",
    "topic": "Chemistry",
    "subtopics": [
      {
        "id": "a-7-1",
        "name": "Matter, States, Atomic Structure & Chemical Bonds",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "a-7-2",
        "name": "Acids, Bases & Salts, Common Chemicals formulas",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-7-3",
        "name": "Metals & Non-metals, Periodic Table properties",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "a-8",
    "subject": "General Awareness",
    "category": "Science",
    "topic": "Biology",
    "subtopics": [
      {
        "id": "a-8-1",
        "name": "Cell Structure & Divisions, Plant/Animal Kingdom",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-8-2",
        "name": "Human Anatomy (Circulatory, Nervous, Digestive systems)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "a-8-3",
        "name": "Vitamins, Nutrients & Human Diseases (Bacteria/Viruses)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "a-9",
    "subject": "General Awareness",
    "category": "Current Affairs",
    "topic": "Current Affairs",
    "subtopics": [
      {
        "id": "a-9-1",
        "name": "National & International News (Past 6-9 Months)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "a-9-2",
        "name": "Sports, Awards, Honors & Nobel Prize winners",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-9-3",
        "name": "Central Govt Schemes, Indexes, Military Exercises",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "a-10",
    "subject": "General Awareness",
    "category": "Static GK",
    "topic": "Important Constitutional Articles (Art 1 - 395)",
    "subtopics": [
      {
        "id": "a-10-1",
        "name": "★ Art 1-4: Name, Territory & New States of the Union",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-2",
        "name": "Art 5-11: Citizenship at commencement & Regulation by Parliament",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "a-10-3",
        "name": "★ Art 14: Equality before law & Equal protection of laws",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-4",
        "name": "★ Art 15: Prohibition of discrimination (Race, Religion, Caste, Sex)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-5",
        "name": "★ Art 16: Equality of opportunity in public employment",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-6",
        "name": "★ Art 17: Abolition of Untouchability & its offenses",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-7",
        "name": "★ Art 18: Abolition of Titles (Military & Academic allowed)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-8",
        "name": "★ Art 19: Protection of 6 Freedoms (Speech, Assembly, Association, etc.)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-9",
        "name": "★ Art 20: Protection in conviction (No double jeopardy/ex-post facto)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-10",
        "name": "★ Art 21: Protection of Life and Personal Liberty (Wide scope)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-11",
        "name": "★ Art 21A: Right to free & compulsory education (Age 6-14)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-12",
        "name": "Art 22: Protection against arrest and detention in certain cases",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "a-10-13",
        "name": "★ Art 23: Prohibition of traffic in human beings & forced labor (Begar)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-14",
        "name": "★ Art 24: Prohibition of employment of children in factories/mines",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-15",
        "name": "★ Art 25: Freedom of conscience, profession, practice & propagation",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-16",
        "name": "Art 29-30: Protection of minority groups & educational rights",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "a-10-17",
        "name": "★ Art 32: Constitutional Remedies (Writs: Habeas Corpus, Mandamus)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "a-10-18",
        "name": "★ Art 39A: Equal justice and free legal aid",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-19",
        "name": "★ Art 40: Organisation of village panchayats",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-20",
        "name": "★ Art 44: Uniform Civil Code for the citizens",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-21",
        "name": "★ Art 48A: Protection of environment, forests & wild life",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-22",
        "name": "★ Art 50: Separation of judiciary from executive",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-23",
        "name": "★ Art 51: Promotion of international peace and security",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-24",
        "name": "★ Art 51A: Fundamental Duties (11 Core obligations of citizens)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-25",
        "name": "Art 52-53: President of India & Executive power of the Union",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "a-10-26",
        "name": "★ Art 54: Election of the President of India",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-27",
        "name": "★ Art 61: Procedure for impeachment of the President",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-28",
        "name": "★ Art 72: Power of President to grant pardons & suspend sentences",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-29",
        "name": "★ Art 74: Council of Ministers to aid & advise President",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-30",
        "name": "★ Art 76: Attorney-General for India",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-31",
        "name": "★ Art 85: Sessions of Parliament, prorogation & dissolution",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-32",
        "name": "★ Art 108: Joint sitting of both Houses in certain cases",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-33",
        "name": "★ Art 110: Definition of Money Bills",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-34",
        "name": "★ Art 112: Annual Financial Statement (Union Budget)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-35",
        "name": "★ Art 123: Power of President to promulgate Ordinances",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-36",
        "name": "★ Art 124: Establishment and constitution of Supreme Court",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-37",
        "name": "★ Art 129: Supreme Court to be a Court of Record",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-38",
        "name": "★ Art 143: Power of President to consult Supreme Court",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-39",
        "name": "★ Art 148: Comptroller and Auditor-General of India (CAG)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-40",
        "name": "★ Art 165: Advocate-General for the State",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-41",
        "name": "★ Art 213: Power of Governor to promulgate Ordinances",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-42",
        "name": "★ Art 226: Power of High Courts to issue certain Writs",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-43",
        "name": "★ Art 239AA: Special provisions with respect to Delhi",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-44",
        "name": "★ Art 243-243O: Panchayati Raj System definitions & powers",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "a-10-45",
        "name": "★ Art 262: Adjudication of inter-State water disputes",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-46",
        "name": "★ Art 263: Provisions with respect to an inter-State Council",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-47",
        "name": "★ Art 280: Finance Commission establishment & duties",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-48",
        "name": "★ Art 300A: Right to Property (44th Amendment legal right)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-49",
        "name": "★ Art 312: Constitutional All-India Services (IAS, IPS, IFS)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-50",
        "name": "★ Art 315: Public Service Commissions (UPSC & State PSCs)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-51",
        "name": "★ Art 324: Election Commission of India superintendence",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-52",
        "name": "★ Art 338 & 338A: National Commissions for SC & ST",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-53",
        "name": "★ Art 343: Official Language of the Union (Hindi in Devanagari)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-54",
        "name": "★ Art 352: Proclamation of National Emergency",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-55",
        "name": "★ Art 356: Provisions for State Emergency (President's Rule)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-56",
        "name": "★ Art 360: Provisions for Financial Emergency",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-57",
        "name": "★ Art 368: Parliament power and procedure to amend Constitution",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "a-10-58",
        "name": "★ Art 370: Temporary provisions of J&K (Abrogated in 2019)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "a-10-59",
        "name": "Art 371A-J: Special provisions for Nagaland, Assam, Karnataka, etc.",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "c-1",
    "subject": "Computer Knowledge",
    "category": "Fundamentals",
    "topic": "Computer Basics & Generations",
    "subtopics": [
      {
        "id": "c-1-1",
        "name": "★ Generations of Computers (1st–5th) & Characteristics",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-1-2",
        "name": "Types of Computers: Analog, Digital, Hybrid; Micro, Mini, Mainframe, Super",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-1-3",
        "name": "★ Number Systems: Binary, Octal, Decimal, Hexadecimal & Conversions",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-1-4",
        "name": "Data Representation: Bits, Bytes, KB, MB, GB, TB & encoding (ASCII, Unicode)",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-1-5",
        "name": "Computer Architecture: Von Neumann model, ALU, CU, Memory, I/O",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "c-2",
    "subject": "Computer Knowledge",
    "category": "Hardware",
    "topic": "Input / Output & Storage Devices",
    "subtopics": [
      {
        "id": "c-2-1",
        "name": "★ Input Devices: Keyboard, Mouse, Scanner, Barcode Reader, Joystick, Touchscreen",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-2-2",
        "name": "★ Output Devices: Monitor types (CRT, LCD, LED, OLED), Printer types, Speakers",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-2-3",
        "name": "★ Primary Memory: RAM (SRAM, DRAM) vs ROM (PROM, EPROM, EEPROM); Cache",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-2-4",
        "name": "★ Secondary Storage: HDD, SSD, Pen Drive, CD, DVD, Blu-ray — capacity & speed",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-2-5",
        "name": "CPU Components: Processor, Motherboard, Ports (USB, HDMI, VGA, PS/2), BIOS",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "c-3",
    "subject": "Computer Knowledge",
    "category": "Software",
    "topic": "Operating Systems & Software Types",
    "subtopics": [
      {
        "id": "c-3-1",
        "name": "★ Types of Software: System Software, Application Software, Utility Software",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-3-2",
        "name": "★ Operating Systems: Windows, Linux, macOS, Android — functions & features",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-3-3",
        "name": "OS Concepts: Multitasking, Multiprocessing, Multiprogramming, Time-sharing",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-3-4",
        "name": "★ File Management: File types, Extensions, Paths, Directories, FAT, NTFS",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-3-5",
        "name": "Programming Languages: Machine, Assembly, High-level; Compiler vs Interpreter",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      }
    ]
  },
  {
    "id": "c-4",
    "subject": "Computer Knowledge",
    "category": "MS Office",
    "topic": "Microsoft Office Suite",
    "subtopics": [
      {
        "id": "c-4-1",
        "name": "★ MS Word: Shortcuts, formatting, Track Changes, Mail Merge, Page Layout",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-4-2",
        "name": "★ MS Excel: Formulas (SUM, AVERAGE, IF, VLOOKUP), Cell references, Charts",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-4-3",
        "name": "★ MS PowerPoint: Slides, Transitions, Animations, Slide Show, Themes",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "c-4-4",
        "name": "MS Access: Tables, Queries, Forms, Reports — basics of DBMS in Access",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "c-4-5",
        "name": "★ Common Shortcuts: Ctrl+Z/Y/X/C/V/S/P/A/F, F1–F12 function keys",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "c-5",
    "subject": "Computer Knowledge",
    "category": "Networking",
    "topic": "Internet, Networking & Communication",
    "subtopics": [
      {
        "id": "c-5-1",
        "name": "★ Network Types: LAN, MAN, WAN, PAN — differences and examples",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-5-2",
        "name": "★ Topologies: Bus, Star, Ring, Mesh, Tree — diagrams and use cases",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-5-3",
        "name": "★ Internet Basics: IP Address (IPv4/IPv6), DNS, HTTP/HTTPS, URL, Domain names",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-5-4",
        "name": "Network Devices: Hub, Switch, Router, Modem, Gateway, Bridge, Repeater",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-5-5",
        "name": "★ Protocols: TCP/IP, FTP, SMTP, POP3, IMAP, Telnet, SSH — ports & uses",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "c-5-6",
        "name": "Wireless: Wi-Fi, Bluetooth, Infrared, 3G/4G/5G, NFC — standards & ranges",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "c-6",
    "subject": "Computer Knowledge",
    "category": "Database",
    "topic": "Database Management Systems (DBMS)",
    "subtopics": [
      {
        "id": "c-6-1",
        "name": "★ DBMS Basics: Tables, Records, Fields, Primary Key, Foreign Key, Relationships",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-6-2",
        "name": "★ SQL Commands: SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-6-3",
        "name": "Database Models: Hierarchical, Network, Relational, Object-oriented",
        "difficulty": "Moderate",
        "weightage": "Medium",
        "effort": "Moderate"
      },
      {
        "id": "c-6-4",
        "name": "ACID Properties: Atomicity, Consistency, Isolation, Durability",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "High"
      }
    ]
  },
  {
    "id": "c-7",
    "subject": "Computer Knowledge",
    "category": "Security",
    "topic": "Cyber Security & Threats",
    "subtopics": [
      {
        "id": "c-7-1",
        "name": "★ Malware Types: Virus, Worm, Trojan Horse, Spyware, Ransomware, Adware",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-7-2",
        "name": "★ Cyber Attacks: Phishing, Hacking, Spoofing, DoS/DDoS, SQL Injection, MitM",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-7-3",
        "name": "★ Security Tools: Firewall, Antivirus, Encryption (SSL/TLS), VPN, Digital Signature",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-7-4",
        "name": "★ Important Cyber Laws: IT Act 2000, Amendments 2008 — key sections (66, 67, 72)",
        "difficulty": "Hard",
        "weightage": "High",
        "effort": "High"
      },
      {
        "id": "c-7-5",
        "name": "Password & Authentication: Strong passwords, 2FA, Biometrics, OTP",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      }
    ]
  },
  {
    "id": "c-8",
    "subject": "Computer Knowledge",
    "category": "Modern Tech",
    "topic": "Emerging Technologies & Abbreviations",
    "subtopics": [
      {
        "id": "c-8-1",
        "name": "★ Cloud Computing: SaaS, PaaS, IaaS — examples (AWS, Azure, Google Cloud)",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-8-2",
        "name": "★ Artificial Intelligence & Machine Learning: Basic concepts, applications",
        "difficulty": "Moderate",
        "weightage": "High",
        "effort": "Moderate"
      },
      {
        "id": "c-8-3",
        "name": "★ Important Full Forms: CPU, RAM, ROM, URL, WWW, HTML, HTTP, FTP, GUI, CLI",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-8-4",
        "name": "E-Commerce & Digital Payments: UPI, NEFT, RTGS, IMPS, Net Banking, Wallets",
        "difficulty": "Easy",
        "weightage": "High",
        "effort": "Low"
      },
      {
        "id": "c-8-5",
        "name": "★ Social Media & Web: Browsers, Search Engines, Cookies, Cache, Web 1.0/2.0/3.0",
        "difficulty": "Easy",
        "weightage": "Medium",
        "effort": "Low"
      },
      {
        "id": "c-8-6",
        "name": "IoT, Blockchain, Big Data, AR/VR — basic definitions and real-world uses",
        "difficulty": "Hard",
        "weightage": "Medium",
        "effort": "High"
      }
    ]
  }
];
const PLAN_DATA = [
  {
    "day": 1,
    "dayType": "study",
    "phase": 1,
    "name": "Shortcuts & Verbals Foundation",
    "desc": "Set up speed tables, Noun rules, basic physics equations, and Coding-Decoding.",
    "targets": [
      "q-10-6",
      "r-1-1",
      "e-1-1",
      "a-2-1"
    ],
    "test": "Vocabulary Drill 1",
    "time": "4.5h"
  },
  {
    "day": 2,
    "dayType": "study",
    "phase": 1,
    "name": "Percentage & Analogy Basics",
    "desc": "Build base for fractions percentage conversions. Practice letter analogy rules.",
    "targets": [
      "q-1-1",
      "r-1-2",
      "r-2-1",
      "e-1-2"
    ],
    "test": "Reasoning Sectional 1",
    "time": "4.5h"
  },
  {
    "day": 3,
    "dayType": "study",
    "phase": 1,
    "name": "Ratio, Proportions & Word analogies",
    "desc": "Master balancing ratio proportions and combining fractional margins.",
    "targets": [
      "q-2-1",
      "q-2-2",
      "r-2-2",
      "e-5-1"
    ],
    "test": "Quant Mini Sectional 1",
    "time": "5.0h"
  },
  {
    "day": 4,
    "dayType": "study",
    "phase": 1,
    "name": "Average & Speed Directions",
    "desc": "Learn consecutive numbers averages and Pythagoras direction maps.",
    "targets": [
      "q-3-1",
      "r-5-1",
      "e-5-2",
      "a-6-1"
    ],
    "test": "Vocabulary Drill 2",
    "time": "5.0h"
  },
  {
    "day": 5,
    "dayType": "study",
    "phase": 1,
    "name": "Advanced Percentage & Pronouns",
    "desc": "Successive change formulas in percentage. Direction shadow rules.",
    "targets": [
      "q-1-2",
      "r-5-2",
      "e-1-3",
      "a-7-1"
    ],
    "test": "None",
    "time": "5.0h"
  },
  {
    "day": 6,
    "dayType": "study",
    "phase": 1,
    "name": "Ratio Advanced & Series patterns",
    "desc": "Income-expense ratio splits. Alphanumeric series logic. Static art and culture.",
    "targets": [
      "q-2-3",
      "r-3-1",
      "e-5-3",
      "a-5-1"
    ],
    "test": "English Vocab Quiz 1",
    "time": "4.5h"
  },
  {
    "day": 7,
    "dayType": "study",
    "phase": 1,
    "name": "Average Group Adjustments & Medieval GK",
    "desc": "Replacement properties of groups. Chronology of Delhi Sultanate.",
    "targets": [
      "q-3-2",
      "r-6-1",
      "e-5-4",
      "a-1-2"
    ],
    "test": "English Grammar Quiz",
    "time": "5.0h"
  },
  {
    "day": 8,
    "dayType": "study",
    "phase": 1,
    "name": "Simplification & Constitution structure",
    "desc": "BODMAS simplifications. Parts, schedules and sources of Indian constitution.",
    "targets": [
      "q-10-1",
      "r-6-2",
      "e-1-5",
      "a-3-1"
    ],
    "test": "Reasoning Speed Test 1",
    "time": "4.5h"
  },
  {
    "day": 9,
    "dayType": "study",
    "phase": 1,
    "name": "Arithmetic Foundations Review",
    "desc": "Resolve incorrect equations in ratios/percent. Review monthly current affairs.",
    "targets": [
      "q-1-3",
      "r-4-1",
      "e-1-4",
      "a-9-1"
    ],
    "test": "GK Static Revision Test",
    "time": "5.5h"
  },
  {
    "day": 10,
    "dayType": "test",
    "phase": 1,
    "name": "Phase 1 Revision & Full Mock Test 1",
    "desc": "Simulate exact exam environment. Spend 3 hours reviewing mock mistakes.",
    "targets": [],
    "test": "Full Length Mock 01 & Analysis",
    "time": "6.0h"
  },
  {
    "day": 11,
    "dayType": "study",
    "phase": 2,
    "name": "Profit & Loss & Paper Folding",
    "desc": "Cost price and selling price ratios. Visual folded cuts. Sentence improvements.",
    "targets": [
      "q-4-1",
      "r-10-1",
      "e-4-1",
      "a-3-2"
    ],
    "test": "English Grammar Test 2",
    "time": "5.0h"
  },
  {
    "day": 12,
    "dayType": "study",
    "phase": 2,
    "name": "Simple Interest & Mirror Images",
    "desc": "Rate and time adjustments. Reflective images in alphabets. Parliament rules.",
    "targets": [
      "q-5-1",
      "r-11-1",
      "e-4-2",
      "a-3-3"
    ],
    "test": "Reasoning Non-Verbal Test",
    "time": "5.0h"
  },
  {
    "day": 13,
    "dayType": "study",
    "phase": 2,
    "name": "Compound Interest & Figure Completion",
    "desc": "CI compounding calculations. Figure completion. Active/Passive voice shifts.",
    "targets": [
      "q-5-2",
      "r-12-1",
      "e-2-1",
      "a-8-3"
    ],
    "test": "Quant CI Sectional",
    "time": "5.5h"
  },
  {
    "day": 14,
    "dayType": "study",
    "phase": 2,
    "name": "Time & Work (LCM) & Dice Rules",
    "desc": "Efficiency and total units via LCM. Dice standard vs open positions.",
    "targets": [
      "q-6-1",
      "r-13-2",
      "e-2-2",
      "a-8-1"
    ],
    "test": "Reasoning Sectional 2",
    "time": "5.0h"
  },
  {
    "day": 15,
    "dayType": "study",
    "phase": 2,
    "name": "TSD & Direct/Indirect Speech",
    "desc": "Relative speed and train crossovers. Direct indirect speech converters.",
    "targets": [
      "q-7-1",
      "r-13-1",
      "e-3-1",
      "a-6-2"
    ],
    "test": "English Voice & Narration Drill",
    "time": "5.5h"
  },
  {
    "day": 16,
    "dayType": "study",
    "phase": 2,
    "name": "Profit & Loss (Discounts)",
    "desc": "Marked price, discounts and successive margins. Indian physical geography.",
    "targets": [
      "q-4-2",
      "r-4-2",
      "e-3-2",
      "a-2-2"
    ],
    "test": "GK Geography Test",
    "time": "5.0h"
  },
  {
    "day": 17,
    "dayType": "study",
    "phase": 2,
    "name": "SI-CI Differences & Syllogism Intro",
    "desc": "2 & 3 year CI-SI differences formulas. Syllogism basics (Some/All Venn).",
    "targets": [
      "q-5-3",
      "r-7-1",
      "e-4-2",
      "a-2-3"
    ],
    "test": "Reasoning Syllogism Quiz",
    "time": "5.5h"
  },
  {
    "day": 18,
    "dayType": "study",
    "phase": 2,
    "name": "Alternate Days Work & Syllogism Cases",
    "desc": "Pipes & cisterns logic. Syllogism possibilities. Cell biology structure.",
    "targets": [
      "q-6-2",
      "q-6-4",
      "r-7-2",
      "a-8-2"
    ],
    "test": "Time-Work Sectional Drill",
    "time": "5.5h"
  },
  {
    "day": 19,
    "dayType": "study",
    "phase": 2,
    "name": "Boats & Streams & Modern History Revolt",
    "desc": "Upstream and downstream speeds. Modern history 1857 revolt details.",
    "targets": [
      "q-7-3",
      "r-7-3",
      "e-4-2",
      "a-1-3"
    ],
    "test": "None",
    "time": "5.0h"
  },
  {
    "day": 20,
    "dayType": "test",
    "phase": 2,
    "name": "Mid-Term Review & Full Mock Test 2",
    "desc": "Evaluate progress in Arithmetic. Spend extra time analyzing mock errors.",
    "targets": [],
    "test": "Full Length Mock 02 & Analysis",
    "time": "6.0h"
  },
  {
    "day": 21,
    "dayType": "study",
    "phase": 2,
    "name": "Partnership & Economics Demand",
    "desc": "Capital time ratio calculations. Demand, supply and elasticity core terms.",
    "targets": [
      "q-9-1",
      "q-9-2",
      "e-1-4",
      "a-4-1"
    ],
    "test": "GK Economics Drill",
    "time": "5.0h"
  },
  {
    "day": 22,
    "dayType": "study",
    "phase": 2,
    "name": "P&L Dishonest Dealer & Judiciary GK",
    "desc": "Cheating weight margins. Supreme Court and CAG articles. Physics optics.",
    "targets": [
      "q-4-3",
      "r-7-2",
      "a-3-4",
      "a-6-3"
    ],
    "test": "Quant P&L Special Test",
    "time": "5.5h"
  },
  {
    "day": 23,
    "dayType": "study",
    "phase": 2,
    "name": "Work & Wages & Chemistry Formulas",
    "desc": "Wage divisions based on work. Acids bases and salts.",
    "targets": [
      "q-6-3",
      "q-6-5",
      "r-7-3",
      "a-7-2"
    ],
    "test": "Science Chemistry Quiz",
    "time": "5.0h"
  },
  {
    "day": 24,
    "dayType": "study",
    "phase": 2,
    "name": "Mixture & Alligation Dilutions",
    "desc": "Dilution formulas. Current Affairs Month 2. Word power lists.",
    "targets": [
      "q-8-1",
      "q-8-2",
      "e-5-2",
      "a-9-2"
    ],
    "test": "GK Current Affairs Test 2",
    "time": "5.0h"
  },
  {
    "day": 25,
    "dayType": "test",
    "phase": 2,
    "name": "Phase 2 Target Mock & Review",
    "desc": "Take a strict timed mock. Mark formulas in mistake notebook.",
    "targets": [],
    "test": "Full Length Mock 03 & Analysis",
    "time": "6.0h"
  },
  {
    "day": 26,
    "dayType": "study",
    "phase": 3,
    "name": "Advanced Number System Remainders",
    "desc": "Remainder theorems (Fermat/Wilson/Euler). Reading Comprehension strategies.",
    "targets": [
      "q-10-2",
      "q-10-4",
      "r-8-1",
      "e-6-1",
      "a-1-1"
    ],
    "test": "English RC Practice (3 Passages)",
    "time": "6.0h"
  },
  {
    "day": 27,
    "dayType": "study",
    "phase": 3,
    "name": "Algebra Identities & Cloze Test",
    "desc": "Quadratic identities and graphs. Cloze test grammar matching.",
    "targets": [
      "q-11-1",
      "q-11-2",
      "r-8-2",
      "e-7-1",
      "a-4-2"
    ],
    "test": "Quant Algebra Drill",
    "time": "6.0h"
  },
  {
    "day": 28,
    "dayType": "study",
    "phase": 3,
    "name": "Geometry Similarity & Para-jumbles",
    "desc": "Triangle centers and similarity. Para jumbles opening sentence links.",
    "targets": [
      "q-12-2",
      "q-12-3",
      "r-9-1",
      "e-8-1",
      "a-4-3"
    ],
    "test": "Reasoning Puzzle Test",
    "time": "6.5h"
  },
  {
    "day": 29,
    "dayType": "study",
    "phase": 3,
    "name": "Geometry Circles & Advanced RC",
    "desc": "Circle tangents, secants properties. Inference based RC questions.",
    "targets": [
      "q-12-4",
      "q-12-5",
      "r-3-2",
      "e-6-2",
      "a-5-2"
    ],
    "test": "English Passage speed drill",
    "time": "6.0h"
  },
  {
    "day": 30,
    "dayType": "study",
    "phase": 3,
    "name": "Mensuration 2D/3D Formulas",
    "desc": "Surface areas and volumes formulas. Cloze vocabulary matching.",
    "targets": [
      "q-13-1",
      "q-13-2",
      "q-13-3",
      "e-7-2"
    ],
    "test": "Quant Mensuration Special",
    "time": "6.5h"
  },
  {
    "day": 31,
    "dayType": "study",
    "phase": 3,
    "name": "Trigonometry Values & Para-jumbles Pairs",
    "desc": "Trig complementary ratios. Para jumbles pronoun connectors.",
    "targets": [
      "q-14-1",
      "q-14-2",
      "r-3-3",
      "e-8-2",
      "a-5-3"
    ],
    "test": "English Jumbles speed run",
    "time": "6.0h"
  },
  {
    "day": 32,
    "dayType": "study",
    "phase": 3,
    "name": "Mensuration Prisms & Chemistry Table",
    "desc": "Pyramids and frustum volumes. Periodic table chemical bonds.",
    "targets": [
      "q-13-4",
      "q-13-5",
      "r-8-1",
      "a-7-3"
    ],
    "test": "Quant Mensuration Advanced",
    "time": "6.5h"
  },
  {
    "day": 33,
    "dayType": "study",
    "phase": 3,
    "name": "Trig Max-Min & Current Affairs 3",
    "desc": "Maximum minimum limits of sin/cos. Government schemes and honors.",
    "targets": [
      "q-14-3",
      "q-14-4",
      "r-8-2",
      "e-5-1",
      "a-9-3"
    ],
    "test": "GK Central Schemes Quiz",
    "time": "6.0h"
  },
  {
    "day": 34,
    "dayType": "study",
    "phase": 3,
    "name": "Statistics, Probability & Mean Mode",
    "desc": "Mean, median, mode calculations and dice probability. National parks static GK.",
    "targets": [
      "q-15-1",
      "q-15-2",
      "q-15-3",
      "a-2-3"
    ],
    "test": "Quant Stats & Prob Quiz",
    "time": "5.5h"
  },
  {
    "day": 35,
    "dayType": "test",
    "phase": 3,
    "name": "Phase 3 Revision & Full Mock Test 4",
    "desc": "Incorporate advanced math topics in the mock. Evaluate speed factors.",
    "targets": [],
    "test": "Full Length Mock 04 & Analysis",
    "time": "6.5h"
  },
  {
    "day": 36,
    "dayType": "simulation",
    "phase": 4,
    "name": "Simulation Run & Mock Test 5",
    "desc": "Simulate exact exam timing. Revise mistake notebook for 2 hours.",
    "targets": [
      "q-16-1",
      "q-16-2",
      "q-16-3"
    ],
    "test": "Full Length Mock 05 & Analysis",
    "time": "6.5h"
  },
  {
    "day": 37,
    "dayType": "simulation",
    "phase": 4,
    "name": "Simulation Run & Mock Test 6",
    "desc": "Complete mock and full qualifying computer section. Memorize GK summaries.",
    "targets": [],
    "test": "Full Length Mock 06 & Computer Test",
    "time": "6.5h"
  },
  {
    "day": 38,
    "dayType": "simulation",
    "phase": 4,
    "name": "Simulation Run & Mock Test 7",
    "desc": "Final full length simulation. Mark remaining errors in mistake log.",
    "targets": [],
    "test": "Full Length Mock 07 & Analysis",
    "time": "6.5h"
  },
  {
    "day": 39,
    "dayType": "simulation",
    "phase": 4,
    "name": "Final Review & Rapid Drill",
    "desc": "Review all formulas in Geometry/Mensuration. Practice 100 synonym flashcards.",
    "targets": [],
    "test": "Quant Formula Rapid Test",
    "time": "5.0h"
  },
  {
    "day": 40,
    "dayType": "exam",
    "phase": 4,
    "name": "Mindset Prep & Strategy Lock",
    "desc": "Relax. Review your formulas. Sleep for 8 hours. You are ready to conquer!",
    "targets": [],
    "test": "Final Strategy Lock",
    "time": "2.0h"
  }
];
const FLASHCARDS = [
  {
    "word": "Pernicious",
    "def": "Having a harmful effect, especially in a gradual or subtle way.",
    "ex": "\"The pernicious influence of negative company.\""
  },
  {
    "word": "Supercilious",
    "def": "Behaving or looking as though one thinks one is superior to others.",
    "ex": "\"A supercilious lady who looked down on servants.\""
  },
  {
    "word": "Ephemeral",
    "def": "Lasting for a very short time; transient.",
    "ex": "\"Fame is ephemeral, but knowledge stays.\""
  },
  {
    "word": "Alacrity",
    "def": "Brisk and cheerful readiness.",
    "ex": "\"She accepted the study challenge with alacrity.\""
  },
  {
    "word": "Cacophony",
    "def": "A harsh, discordant mixture of sounds.",
    "ex": "\"The cacophony of the busy marketplace.\""
  },
  {
    "word": "Benevolent",
    "def": "Well-meaning and kindly.",
    "ex": "\"A benevolent teacher who helped poor children.\""
  },
  {
    "word": "Burn the midnight oil",
    "def": "To study or work late into the night.",
    "ex": "\"He is burning the midnight oil for the CGL exam.\""
  },
  {
    "word": "A feather in one's cap",
    "def": "An achievement to be proud of.",
    "ex": "\"Clearing CGL with Rank 1 will be a feather in his cap.\""
  },
  {
    "word": "By leaps and bounds",
    "def": "Very rapidly; making quick progress.",
    "ex": "\"His speed has improved by leaps and bounds.\""
  },
  {
    "word": "Spick and span",
    "def": "Neat, clean, and well-organized.",
    "ex": "\"The study desk was kept spick and span.\""
  },
  {
    "word": "Loquacious",
    "def": "Tending to talk a great deal; extremely talkative.",
    "ex": "\"A loquacious candidate lost time in interviews.\""
  },
  {
    "word": "Pragmatic",
    "def": "Dealing with things sensibly and realistically based on practical experiences.",
    "ex": "\"A pragmatic study plan is better than a fantasy one.\""
  },
  {
    "word": "Red Herring",
    "def": "Something, especially a clue, that is or is intended to be misleading.",
    "ex": "\"The mock question had a red herring option.\""
  },
  {
    "word": "At one's beck and call",
    "def": "Always ready to obey someone's orders immediately.",
    "ex": "\"You must not be at anyone's beck and call during study hours.\""
  },
  {
    "word": "Frugal",
    "def": "Sparing or economical with regard to money or food; simple.",
    "ex": "\"Living a frugal life to save time and resources.\""
  }
];
const EMBEDDED_QUIZZES = {
  "english": [
    {
      "q": "Synonym of 'ABATE':",
      "o": [
        "Diminish",
        "Increase",
        "Prolong",
        "Intensify"
      ],
      "a": 0,
      "level": "easy"
    },
    {
      "q": "Antonym of 'ALACRITY':",
      "o": [
        "Enthusiasm",
        "Apathy",
        "Swiftness",
        "Zeal"
      ],
      "a": 1,
      "level": "medium"
    },
    {
      "q": "Find the correctly spelled word:",
      "o": [
        "Committee",
        "Comitee",
        "Committe",
        "Comitte"
      ],
      "a": 0,
      "level": "advance"
    },
    {
      "q": "One Word Substitution: 'One who hates mankind'",
      "o": [
        "Philanthropist",
        "Misogynist",
        "Misanthrope",
        "Egotist"
      ],
      "a": 2,
      "level": "easy"
    },
    {
      "q": "Idiom Meaning: 'To spill the beans'",
      "o": [
        "To cook beans",
        "To reveal a secret",
        "To waste money",
        "To cause an accident"
      ],
      "a": 1,
      "level": "medium"
    },
    {
      "q": "Synonym of 'FUTILE':",
      "o": [
        "Fruitful",
        "Useless",
        "Productive",
        "Important"
      ],
      "a": 1,
      "level": "advance"
    },
    {
      "q": "Antonym of 'HOSTILE':",
      "o": [
        "Friendly",
        "Adverse",
        "Antagonistic",
        "Unkind"
      ],
      "a": 0,
      "level": "easy"
    },
    {
      "q": "Identify the part of speech of the underlined word: 'She runs fast.'",
      "o": [
        "Noun",
        "Adjective",
        "Adverb",
        "Verb"
      ],
      "a": 2,
      "level": "medium"
    }
  ],
  "reasoning": [
    {
      "q": "Complete the series: 3, 7, 15, 31, 63, ?",
      "o": [
        "127",
        "95",
        "128",
        "125"
      ],
      "a": 0,
      "level": "easy"
    },
    {
      "q": "If 'MONKEY' is coded as 'XDJMNL', how is 'TIGER' coded?",
      "o": [
        "SDFHS",
        "QDFHS",
        "QDYTR",
        "SDFTR"
      ],
      "a": 1,
      "level": "medium"
    },
    {
      "q": "In a family, A is B's brother, C is A's father, D is C's mother. How is B related to D?",
      "o": [
        "Grandson",
        "Granddaughter",
        "Grandchild",
        "Daughter-in-law"
      ],
      "a": 2,
      "level": "advance"
    },
    {
      "q": "Select the odd one out: 27, 64, 125, 144",
      "o": [
        "27",
        "64",
        "125",
        "144"
      ],
      "a": 3,
      "level": "easy"
    },
    {
      "q": "Find the next term in the series: B2D, E3G, H4J, ?",
      "o": [
        "K5M",
        "K6N",
        "L5M",
        "K5N"
      ],
      "a": 0,
      "d": "easy",
      "level": "medium"
    },
    {
      "q": "Pointing to a photograph, a man said: 'I have no brother or sister, but that man's father is my father's son.' Whose photograph was it?",
      "o": [
        "His own",
        "His father's",
        "His son's",
        "His nephew's"
      ],
      "a": 2,
      "d": "hard",
      "level": "advance"
    },
    {
      "q": "If '+' means '×', '-' means '÷', '×' means '-' and '÷' means '+', then: 16 + 4 - 8 × 2 ÷ 3 = ?",
      "o": [
        "12",
        "9",
        "6",
        "11"
      ],
      "a": 1,
      "d": "medium",
      "level": "easy"
    },
    {
      "q": "A clock shows 4:30. If the minute hand points East, in which direction does the hour hand point?",
      "o": [
        "North",
        "North-East",
        "South-East",
        "North-West"
      ],
      "a": 1,
      "d": "hard",
      "level": "medium"
    },
    {
      "q": "If A=1, FAT=27, then FAITH = ?",
      "o": [
        "44",
        "42",
        "40",
        "41"
      ],
      "a": 0,
      "d": "hard",
      "level": "advance"
    },
    {
      "q": "Which number replaces the question mark? 12 : 144 :: 13 : ?",
      "o": [
        "169",
        "156",
        "182",
        "196"
      ],
      "a": 0,
      "d": "medium",
      "level": "easy"
    },
    {
      "q": "What is the alphabetical position of letter 'K'?",
      "o": [
        "10",
        "11",
        "12",
        "9"
      ],
      "a": 1,
      "d": "easy",
      "level": "medium"
    },
    {
      "q": "What is the reverse alphabetical position of letter 'T' (where Z=1)?",
      "o": [
        "7",
        "8",
        "6",
        "9"
      ],
      "a": 0,
      "d": "medium",
      "level": "advance"
    },
    {
      "q": "Which letter is opposite to 'Q' in the alphabet (where A is opposite to Z)?",
      "o": [
        "J",
        "K",
        "I",
        "L"
      ],
      "a": 0,
      "d": "medium",
      "level": "easy"
    }
  ],
  "computer": [
    {
      "q": "Which of the following keyboard shortcut is used to close the active application window in MS Windows OS?",
      "o": [
        "Alt + F4",
        "Ctrl + C",
        "Win + L",
        "Alt + Tab"
      ],
      "a": 0,
      "d": "easy",
      "level": "easy"
    },
    {
      "q": "What is the default port number used by HTTPS (Secure Hypertext Protocol)?",
      "o": [
        "Port 80",
        "Port 21",
        "Port 443",
        "Port 22"
      ],
      "a": 2,
      "d": "easy",
      "level": "medium"
    },
    {
      "q": "Which keyboard command opens the 'Run' utility dialog box in Windows OS?",
      "o": [
        "Win + R",
        "Win + E",
        "Win + D",
        "Ctrl + Shift + Esc"
      ],
      "a": 0,
      "d": "easy",
      "level": "advance"
    },
    {
      "q": "What is the network protocol port number commonly used for sending email messages (SMTP)?",
      "o": [
        "Port 25",
        "Port 110",
        "Port 143",
        "Port 53"
      ],
      "a": 0,
      "d": "medium",
      "level": "easy"
    },
    {
      "q": "Which key combination launches the Windows Task Manager directly?",
      "o": [
        "Ctrl + Alt + Del",
        "Ctrl + Shift + Esc",
        "Win + Tab",
        "Alt + Shift + Enter"
      ],
      "a": 1,
      "d": "medium",
      "level": "medium"
    },
    {
      "q": "In Microsoft Excel, which cell referencing remains completely fixed when a formula is copy-pasted?",
      "o": [
        "Relative (A1)",
        "Absolute ($A$1)",
        "Mixed ($A1)",
        "Dynamic (A1:B1)"
      ],
      "a": 1,
      "d": "medium",
      "level": "advance"
    },
    {
      "q": "Which Excel formula is used to look up a value in the leftmost column of a table and return a value in the same row?",
      "o": [
        "HLOOKUP",
        "VLOOKUP",
        "LOOKUP",
        "MATCH"
      ],
      "a": 1,
      "d": "medium",
      "level": "easy"
    },
    {
      "q": "What malware encrypts the user's hard drive files and demands payment to decrypt them?",
      "o": [
        "Ransomware",
        "Trojan",
        "Adware",
        "Rootkit"
      ],
      "a": 0,
      "d": "hard",
      "level": "medium"
    },
    {
      "q": "A firewall is primarily used in networking systems to protect against which of the following?",
      "o": [
        "Virus transmission in flash drives",
        "Unauthorized incoming/outgoing network access",
        "Power supply fluctuations",
        "Physical theft of hard disks"
      ],
      "a": 1,
      "d": "hard",
      "level": "advance"
    },
    {
      "q": "Which type of malware replicates itself across computer networks without needing to attach to a host file?",
      "o": [
        "Trojan Horse",
        "Ransomware",
        "Worm",
        "Spyware"
      ],
      "a": 2,
      "d": "hard",
      "level": "easy"
    }
  ],
  "gk": [
    {
      "q": "River Ganga originates from which of the following glaciers?",
      "o": [
        "Yamunotri",
        "Gangotri",
        "Alkapuri",
        "Milam"
      ],
      "a": 1,
      "d": "easy",
      "level": "easy"
    },
    {
      "q": "Which river is also known as 'Dakshin Ganga' due to its length and size?",
      "o": [
        "Krishna",
        "Cauvery",
        "Godavari",
        "Mahanadi"
      ],
      "a": 2,
      "d": "easy",
      "level": "medium"
    },
    {
      "q": "On which river is the Sardar Sarovar Dam constructed?",
      "o": [
        "Narmada",
        "Tapi",
        "Sabarmati",
        "Mahi"
      ],
      "a": 0,
      "d": "easy",
      "level": "advance"
    },
    {
      "q": "Which of the following is the highest peak in the Western Ghats of India?",
      "o": [
        "Doda Betta",
        "Anamudi",
        "Mahendragiri",
        "Kalsubai"
      ],
      "a": 1,
      "d": "medium",
      "level": "easy"
    },
    {
      "q": "The Kanchenjunga peak, the third highest mountain in the world, is located in which Indian state?",
      "o": [
        "Uttarakhand",
        "Himachal Pradesh",
        "Sikkim",
        "Arunachal Pradesh"
      ],
      "a": 2,
      "d": "medium",
      "level": "medium"
    },
    {
      "q": "Which is the longest dam in India, built across the Mahanadi river in Odisha?",
      "o": [
        "Tehri Dam",
        "Bhakra Dam",
        "Hirakud Dam",
        "Nagarjuna Sagar Dam"
      ],
      "a": 2,
      "d": "medium",
      "level": "advance"
    },
    {
      "q": "Which boundary line separates the territories of India and China?",
      "o": [
        "Radcliffe Line",
        "McMahon Line",
        "Durand Line",
        "Line of Control"
      ],
      "a": 1,
      "d": "medium",
      "level": "easy"
    },
    {
      "q": "In which year did the famous Battle of Haldighati take place between Akbar and Maharana Pratap?",
      "o": [
        "1556",
        "1576",
        "1526",
        "1586"
      ],
      "a": 1,
      "d": "hard",
      "level": "medium"
    },
    {
      "q": "Who was the founder of the ancient Maurya Dynasty in India?",
      "o": [
        "Ashoka",
        "Chandragupta Maurya",
        "Bindusara",
        "Chandragupta I"
      ],
      "a": 1,
      "d": "hard",
      "level": "advance"
    },
    {
      "q": "The historic First Battle of Panipat was fought in which year?",
      "o": [
        "1526",
        "1556",
        "1761",
        "1530"
      ],
      "a": 0,
      "d": "hard",
      "level": "easy"
    },
    {
      "q": "In which year did Mahatma Gandhi lead the Dandi Salt March?",
      "o": [
        "1920",
        "1930",
        "1942",
        "1919"
      ],
      "a": 1,
      "d": "hard",
      "level": "medium"
    }
  ]
};
const ENGLISH_QUESTIONS = EMBEDDED_QUIZZES.english;
const REASONING_QUESTIONS = EMBEDDED_QUIZZES.reasoning;
const COMP_QUESTIONS = EMBEDDED_QUIZZES.computer;
const GK_QUESTIONS = EMBEDDED_QUIZZES.gk;

async function loadApplicationData() {
    console.log("Application databases successfully loaded directly from inline JS objects.");
}


let appState = {
    theme: "dark",
    currentDay: 1,
    syllabusProgress: {}, // Format: { subtopicId: { learned: bool, practiced: bool, mastered: bool } }
    mocks: [],            // Format: Array of mock objects
    notes: [],            // Format: Array of notes objects
    sessionTime: 0,       // Seconds
    sessionActive: false,
    pomoTime: 1500,       // Default 25m study
    pomoActive: false,
    pomoMode: "study",    // "study", "short-break", "long-break"
    dailyRituals: { drill: false, vocab: false, ca: false, computer: false },
    speechEnabled: true,  // Default speech enabled
    toastEnabled: true,   // Default toasts enabled
    examTier: 1           // Default exam tier target (1 = Tier 1, 2 = Tier 2)
};

// Timer Intervals
let sessionTimerInterval = null;
let pomoTimerInterval = null;
const pomoRingCircumference = 390; // 2 * PI * 85

// Math Typesetting trigger using KaTeX
function triggerMathTypesetting() {
    if (window.renderMathInElement) {
        window.renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: '\\(', right: '\\)', display: false},
                {left: '\\[', right: '\\]', display: true}
            ],
            throwOnError: false
        });
    } else if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise().catch(err => console.log('MathJax error:', err));
    }
}

// Global Text-to-Speech announcer with queue clearing and toggle check
function speakText(txt) {
    if ('speechSynthesis' in window && appState.speechEnabled !== false) {
        try {
            window.speechSynthesis.cancel(); // Stop current speech to be responsive
            const utterance = new SpeechSynthesisUtterance(txt);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn("Speech synthesis error:", e);
        }
    }
}
window.speakText = speakText;


// Load state from local storage
function loadStateFromStorage() {
    const saved = localStorage.getItem("ssc_cgl_state");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState = { ...appState, ...parsed };
            // Guard all required fields
            if (!appState.weakAlerts) appState.weakAlerts = {};
            if (!appState.examName) appState.examName = "Conquest";
            if (!appState.examDate) appState.examDate = "2026-08-15";
            if (appState.speechEnabled === undefined) appState.speechEnabled = true;
            if (appState.toastEnabled === undefined) appState.toastEnabled = true;
            if (appState.examTier === undefined) appState.examTier = 1;
            if (!appState.mocks) appState.mocks = [];
            if (!appState.notes) appState.notes = [];
            if (!appState.dailyRituals) appState.dailyRituals = { drill: false, vocab: false, ca: false, computer: false };
            if (!appState.syllabusProgress) appState.syllabusProgress = {};
            // Hydrate any new syllabus entries not yet in saved state
            SYLLABUS_DATA.forEach(topic => {
                topic.subtopics.forEach(sub => {
                    if (!appState.syllabusProgress[sub.id]) {
                        appState.syllabusProgress[sub.id] = { learned: false, practiced: false, mastered: false };
                    }
                });
            });
        } catch (e) {
            console.error("Error loading localStorage state:", e);
        }
    } else {
        // Build initial empty state for syllabus
        SYLLABUS_DATA.forEach(topic => {
            topic.subtopics.forEach(sub => {
                appState.syllabusProgress[sub.id] = { learned: false, practiced: false, mastered: false };
            });
        });
        appState.weakAlerts = {};
        appState.examName = "Conquest";
        appState.examDate = "2026-08-15";
        saveStateToStorage();
    }
}

// Save state to local storage
function saveStateToStorage() {
    try {
        localStorage.setItem("ssc_cgl_state", JSON.stringify(appState));
    } catch (e) {
        console.error("Failed to save state to localStorage:", e);
    }
}

// Global Markdown Parsing Utility
function parseMarkdown(text) {
    if (!text) return "";
    
    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^### (.*?)$/gm, '<h5 class="text-xs font-bold text-white mt-2 mb-1">$1</h5>');
    html = html.replace(/^## (.*?)$/gm, '<h4 class="text-sm font-bold text-white mt-3 mb-1">$1</h4>');
    html = html.replace(/^# (.*?)$/gm, '<h3 class="text-base font-extrabold text-white mt-4 mb-2">$1</h3>');

    // Bold (**text**)
    html = html.replace(/\*\*(.*?)\*\"/g, '<strong class="text-white font-extrabold">$1</strong>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-extrabold">$1</strong>');

    // Italic (*text*)
    html = html.replace(/\*(.*?)\*/g, '<em class="text-gray-200 italic">$1</em>');

    // Links ([text](url))
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, (match, text, url) => {
        const cleanUrl = url.trim();
        if (cleanUrl.toLowerCase().startsWith('javascript:')) {
            return `<span class="text-accentRose font-bold font-mono">[Unsafe Link Blocked]</span>`;
        }
        if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg') || cleanUrl.endsWith('.png') || cleanUrl.endsWith('.gif') || cleanUrl.endsWith('.svg')) {
            return `<div class="my-3 overflow-hidden rounded-xl border border-white/5 bg-black/10"><img src="${cleanUrl}" alt="${text}" class="w-full h-auto block" loading="lazy"></div>`;
        }
        return `<a href="${cleanUrl}" target="_blank" class="text-accentCyan hover:underline font-bold">${text}</a>`;
    });

    // Blockquotes
    html = html.replace(/^&gt; (.*?)$/gm, '<blockquote class="border-l-2 border-accentPurple pl-2 text-gray-400 my-1.5 italic bg-white/2px p-1 rounded">$1</blockquote>');

    // Code blocks / Inline code
    html = html.replace(/`(.*?)`/g, '<code class="bg-black/40 px-1 py-0.5 rounded font-mono text-accentCyan text-[10px]">$1</code>');

    // Horizontal Rule
    html = html.replace(/^---$/gm, '<hr class="border-white/5 my-2">');

    // Parse tables
    const lines = html.split('\n');
    let inTable = false;
    let tableHtml = '';
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
            const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
            if (!inTable) {
                inTable = true;
                tableHtml = '<div class="overflow-x-auto my-3"><table class="w-full text-left text-[11px] border-collapse"><thead>';
                tableHtml += '<tr class="border-b border-white/10 text-gray-400 font-bold text-[9px] uppercase">';
                cells.forEach(c => tableHtml += `<th class="pb-1">${c}</th>`);
                tableHtml += '</tr></thead><tbody class="text-gray-300 font-mono">';
            } else {
                if (cells.every(c => c.match(/^:-*:-*$|^-+$|^:-+$|^-+:$/))) {
                    lines[i] = '';
                    continue;
                }
                tableHtml += '<tr class="border-b border-white/5">';
                cells.forEach(c => tableHtml += `<td class="py-1">${c}</td>`);
                tableHtml += '</tr>';
            }
            lines[i] = '';
        } else {
            if (inTable) {
                inTable = false;
                tableHtml += '</tbody></table></div>';
                lines[i] = tableHtml + '\n' + lines[i];
                tableHtml = '';
            }
        }
    }
    if (inTable) {
        tableHtml += '</tbody></table></div>';
        lines.push(tableHtml);
    }
    html = lines.filter(l => l !== '').join('\n');

    // Bullet Lists (- or *)
    html = html.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="list-disc list-inside ml-2 text-gray-300">$1</li>');

    // Lists wrapper
    html = html.replace(/(<li.*?>.*?<\/li>)+/gs, '<ul>$&</ul>');

    // Newlines mapping
    html = html.replace(/\n\n/g, '<p class="my-2"></p>');
    html = html.replace(/\n/g, '<br>');

    return html;
}
window.parseMarkdown = parseMarkdown;

// Readable Date Formatter (DD MMM, YYYY)
function formatDateReadable(dateStr) {
    if (!dateStr) return "N/A";
    const cleanStr = dateStr.split("T")[0];
    const parts = cleanStr.split("-");
    if (parts.length !== 3) return dateStr;
    const year = parseInt(parts[0]);
    const monthIdx = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (isNaN(year) || isNaN(monthIdx) || isNaN(day) || !months[monthIdx]) return dateStr;
    return `${day.toString().padStart(2, "0")} ${months[monthIdx]}, ${year}`;
}
window.formatDateReadable = formatDateReadable;


// === GK STATIC DATA (INLINE COMPILED) ===
const GK_STATIC_DATA = {
  polity: [
  {
    "title": "🔥 Top 15 Articles to Memorize First",
    "content": "These 15 articles carry 80% of the weightage for direct factual questions in SSC exams. Memorize these cold before studying the rest!\n\n| Article | Topic | Core Detail |\n| --- | --- | --- |\n| **Article 1** | India, Union of States | Defines territory of India |\n| **Article 14** | Equality | Equality before law & equal protection |\n| **Article 19** | Freedom | Six fundamental democratic freedoms |\n| **Article 21** | Right to Life | Protection of life and personal liberty |\n| **Article 21A** | Education | Free & compulsory education for 6-14 yrs |\n| **Article 32** | Constitutional Remedies | Right to move SC for FR enforcement |\n| **Article 39A** | Free Legal Aid | Free legal services for poor citizens |\n| **Article 44** | Uniform Civil Code (UCC) | Uniform laws for all religious communities |\n| **Article 51A** | Fundamental Duties | 11 core citizen responsibilities |\n| **Article 52** | President | Defines the head of executive |\n| **Article 74** | Council of Ministers | PM & Cabinet to advise the President |\n| **Article 80** | Rajya Sabha | Composition of the Upper House |\n| **Article 110** | Money Bill | Definition & procedures for Money Bills |\n| **Article 324** | Election Commission | Supervise, direct, & control elections |\n| **Article 368** | Constitutional Amendment | Power & procedure of Parliament to amend |"
  },
  {
    "title": "🏆 Tier 1 Constitutional Articles (Must Know)",
    "content": "High frequency articles frequently tested in Tier-1 exams.\n\n| Article | Part | Topic | Memory Trick |\n| --- | --- | --- | --- |\n| **1** | I | India – Union of States | **1 India** |\n| **3** | I | Formation of new States | **3** = Three ways: create, merge, rename |\n| **5–11** | II | Citizenship | **5–11** = Citizen |\n| **12** | III | Definition of State | Start of Rights |\n| **13** | III | Laws violating FR are void | **13** = Unlucky law |\n| **14** | III | Equality before Law | **1+4 = Equal** (5 fingers each hand) |\n| **15** | III | No discrimination | **15** = No discrimination |\n| **16** | III | Equal opportunity in jobs | **16** = Government Jobs |\n| **17** | III | Abolition of Untouchability | **17** breaks social barriers |\n| **18** | III | Abolition of Titles | **18** = No \"Sir\", \"Raja\" |\n| **19** | III | Six Fundamental Freedoms | **19** = Freedom |\n| **20** | III | Protection in criminal cases | Criminal safeguards |\n| **21** | III | Right to Life & Personal Liberty | **21** = Life |\n| **21A** | III | Education (6–14 years) | **A** = Admission to school |\n| **22** | III | Protection against arrest | Police article |\n| **23** | III | Human trafficking prohibited | Human dignity |\n| **24** | III | Child labour prohibited | Children |\n| **25–28** | III | Freedom of Religion | Religion block |\n| **29–30** | III | Cultural & Educational Rights | Minorities |\n| **32** | III | Constitutional Remedies | **Heart & Soul** (Ambedkar) |\n| **36–51** | IV | DPSP | Welfare State |\n| **39A** | IV | Free Legal Aid | **A** = Advocate |\n| **40** | IV | Panchayats | Village governance |\n| **44** | IV | Uniform Civil Code | **UCC** |\n| **48A** | IV | Environment | **A** = Air & Animals |\n| **49** | IV | Monuments | Heritage |\n| **50** | IV | Separation of Judiciary | Judges |\n| **51** | IV | International Peace | UN |"
  },
  {
    "title": "⭐ Tier 2 Articles (Very High Frequency)",
    "content": "Highly predictable articles relating to Union Executive & Parliament.\n\n| Article | Part | Topic | Memory Trick |\n| --- | --- | --- | --- |\n| **51A** | IVA | Fundamental Duties | **A** = Actions (Duties) |\n| **52** | V | President | President starts Union Executive |\n| **54** | V | Election of President | Electoral College |\n| **61** | V | Impeachment of President | Remove President |\n| **63** | V | Vice-President | **VP** |\n| **74** | V | Council of Ministers | PM advises President |\n| **75** | V | Prime Minister | PM & Council |\n| **76** | V | Attorney General | Government lawyer |\n| **80** | V | Rajya Sabha Composition | **80** = Upper House |\n| **81** | V | Lok Sabha Composition | **81** = Lower House |\n| **83** | V | Term of Parliament | 5 years |\n| **85** | V | Sessions of Parliament | Summon/Prorogue |\n| **110** | V | Money Bill | **110** = Money |\n| **112** | V | Union Budget | Annual Financial Statement |\n| **123** | V | President's Ordinance | Emergency lawmaking |\n| **124** | V | Supreme Court | SC starts at 124 |\n| **143** | V | President seeks SC advice | Advisory Jurisdiction |"
  },
  {
    "title": "⭐ Tier 3 Articles (Frequently Asked)",
    "content": "Frequently queried bodies, offices, and emergency provisions.\n\n| Article | Topic | Core Detail |\n| --- | --- | --- |\n| **148** | CAG | Comptroller & Auditor General of India |\n| **153** | Governor | Governors of States |\n| **155** | Appointment of Governor | Appointed by President of India |\n| **163** | Gov Council of Ministers | Cabinet to aid and advise Governor |\n| **165** | Advocate General | State legal adviser |\n| **214** | High Court | High Courts for States |\n| **226** | HC Writs | Power of High Courts to issue writs |\n| **243** | Panchayats | Definitions & Gram Sabha |\n| **243P** | Municipalities | Definitions & Composition |\n| **280** | Finance Commission | Recommends tax distribution |\n| **300A** | Right to Property | Legal/Constitutional Right (not FR) |\n| **312** | All India Services | IAS, IPS, IFS |\n| **315** | UPSC | Public Service Commissions |\n| **324** | Election Commission | Superintends election process |\n| **330** | SC/ST LS Reservation | Reserved seats in Lok Sabha |\n| **343** | Official Language | Hindi in Devanagari script |\n| **352** | National Emergency | War, external aggression, armed rebellion |\n| **356** | President's Rule | Failure of constitutional machinery |\n| **360** | Financial Emergency | Threat to financial stability |\n| **368** | Constitutional Amendment | Power of Parliament to amend |"
  },
  {
    "title": "🗺️ Constitution Articles Memory Roadmap",
    "content": "Organize article numbers by Part to build a clear mental schema.\n\n```text\nPart I (Union & Territory) ─── [1, 3]\n│\nPart II (Citizenship) ──────── [5-11]\n│\nPart III (Fundamental Rights) ─ [12, 13, 14, 15, 16, 17, 18, 19, 21, 21A, 32]\n│\nPart IV (DPSP) ─────────────── [39A, 44, 48A]\n│\nPart IVA (Duties) ──────────── [51A]\n│\nPart V (Union Government) ──── [52, 74, 80, 110, 124]\n│\nPart XV (Elections) ────────── [324]\n│\nPart XVIII (Emergencies) ───── [352, 356, 360]\n│\nPart XX (Amendment) ────────── [368]\n```"
  },
  {
    "title": "🎯 Daily Micro Trick: The 5-Point Memory Chain",
    "content": "To memorize effectively, link each article using this 5-point chain:\n\n`Article` → `Part` → `Topic` → `Keyword` → `PYQ Fact`\n\n> **Example: Article 32**\n> - **Article**: Article 32\n> - **Part**: Part III\n> - **Topic**: Constitutional Remedies\n> - **Keyword**: Heart & Soul\n> - **PYQ Fact**: Called the \"Heart and Soul of the Constitution\" by Dr. B. R. Ambedkar"
  }
],
  history: [
  {
    "title": "⚔️ Crucial Battles & Timelines",
    "content": "| Event / Battle | Year | Key Detail / Significance |\n| --- | --- | --- |\n| **Harappa Excavation** | 1921 | Excavated by Daya Ram Sahni |\n| **Mohenjodaro Excavation** | 1922 | Excavated by R.D. Banerjee |\n| **1st Battle of Tarain** | 1191 | Prithviraj Chauhan defeats Mohammad Ghori |\n| **2nd Battle of Tarain** | 1192 | Mohammad Ghori defeats Prithviraj Chauhan |\n| **1st Battle of Panipat** | 1526 | Babur defeats Ibrahim Lodi (Mughal rule starts) |\n| **2nd Battle of Panipat** | 1556 | Akbar defeats Hemu |\n| **3rd Battle of Panipat** | 1761 | Ahmad Shah Abdali defeats Marathas |\n| **Battle of Plassey** | 1757 | Robert Clive defeats Nawab Siraj-ud-Daulah |\n| **Battle of Buxar** | 1764 | British defeat joint Mughal / Nawab alliance |"
  }
],
  geography: {
  "rivers": [
    {
      "name": "Ganga",
      "length": "2,525 km",
      "origin": "Gangotri Glacier (UK)",
      "detail": "Devprayag (Alaknanda + Bhagirathi)"
    },
    {
      "name": "Godavari",
      "length": "1,465 km",
      "origin": "Trimbakeshwar (MH)",
      "detail": "Known as 'Dakshin Ganga' (Peninsular longest)"
    },
    {
      "name": "Krishna",
      "length": "1,400 km",
      "origin": "Mahabaleshwar (MH)",
      "detail": "Tributaries: Tungabhadra & Bhima"
    },
    {
      "name": "Yamuna",
      "length": "1,376 km",
      "origin": "Yamunotri (UK)",
      "detail": "Largest tributary of Ganga, merges at Prayagraj"
    },
    {
      "name": "Narmada",
      "length": "1,312 km",
      "origin": "Amarkantak (MP)",
      "detail": "West flowing through rift valley, Dhuandhar falls"
    },
    {
      "name": "Indus",
      "length": "1,114 km",
      "origin": "Mansarovar (Tibet)",
      "detail": "Flows through Ladakh; enters Pakistan"
    },
    {
      "name": "Brahmaputra",
      "length": "916 km",
      "origin": "Angsi Glacier (Tibet)",
      "detail": "Called Tsangpo in Tibet, Dihang in Arunachal"
    },
    {
      "name": "Mahanadi",
      "length": "851 km",
      "origin": "Sihawa (Chhattisgarh)",
      "detail": "Hirakud Dam (Odisha) built on it"
    }
  ],
  "mountains": [
    {
      "range": "Karakoram",
      "peak": "K2 (Godwin-Austen)",
      "elevation": "8,611m",
      "detail": "Highest peak in India region (Ladakh)"
    },
    {
      "range": "Himalayas",
      "peak": "Kanchenjunga",
      "elevation": "8,586m",
      "detail": "Sikkim, world's 3rd highest peak"
    },
    {
      "range": "Western Ghats",
      "peak": "Anamudi",
      "elevation": "2,695m",
      "detail": "Kerala, Sahyadri biodiversity hotspot"
    },
    {
      "range": "Aravali",
      "peak": "Guru Shikhar",
      "elevation": "1,722m",
      "detail": "Rajasthan, oldest fold mountain range"
    },
    {
      "range": "Satpura",
      "peak": "Dhupgarh",
      "elevation": "1,350m",
      "detail": "Madhya Pradesh (Panchmarhi)"
    },
    {
      "range": "Eastern Ghats",
      "peak": "Jindhagada Peak",
      "elevation": "1,690m",
      "detail": "Andhra Pradesh (Discontinuous range)"
    },
    {
      "range": "Vindhya",
      "peak": "Sadbhawna Shikhar",
      "elevation": "752m",
      "detail": "MP, divides North & South India"
    }
  ],
  "dams": [
    {
      "name": "Tehri Dam",
      "river": "Bhagirathi",
      "state": "Uttarakhand",
      "significance": "Highest Dam in India (260.5m)"
    },
    {
      "name": "Hirakud Dam",
      "river": "Mahanadi",
      "state": "Odisha",
      "significance": "Longest Dam in India (25.8 km)"
    },
    {
      "name": "Bhakra Nangal",
      "river": "Sutlej",
      "state": "Himachal Pradesh",
      "significance": "Largest concrete gravity dam"
    },
    {
      "name": "Nagarjuna Sagar",
      "river": "Krishna",
      "state": "Andhra / Telangana",
      "significance": "Largest masonry dam in the world"
    },
    {
      "name": "Sardar Sarovar",
      "river": "Narmada",
      "state": "Gujarat",
      "significance": "Major gravity dam supplying GJ, MP, MH"
    }
  ],
  "passes": [
    {
      "name": "Shipki La",
      "detail": "Satluj river enters India (Himachal Pradesh)"
    },
    {
      "name": "Nathu La",
      "detail": "Indo-China trade border pass (Sikkim)"
    },
    {
      "name": "Zoji La",
      "detail": "Srinagar to Leh connectivity highway (Ladakh)"
    },
    {
      "name": "Borders",
      "detail": "McMahon Line (India-China), Radcliffe Line (India-Pakistan)"
    }
  ]
},
  science: {
  "units": [
    {
      "name": "Force",
      "unit": "Newton (N)"
    },
    {
      "name": "Work/Energy",
      "unit": "Joule (J)"
    },
    {
      "name": "Power",
      "unit": "Watt (W)"
    },
    {
      "name": "Pressure",
      "unit": "Pascal (Pa)"
    },
    {
      "name": "Resistance",
      "unit": "Ohm (\\Omega)"
    },
    {
      "name": "Magnetic Flux",
      "unit": "Weber (Wb)"
    },
    {
      "name": "Frequency",
      "unit": "Hertz (Hz)"
    },
    {
      "name": "Charge",
      "unit": "Coulomb (C)"
    },
    {
      "name": "Luminous",
      "unit": "Lumen (lm)"
    }
  ],
  "facts": "Constants: $c \\approx 3 \\times 10^8 \\text{ m/s}$, $g = 9.8 \\text{ m/s}^2$, $G = 6.674 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2$, $h = 6.626 \\times 10^{-34} \\text{ J}\\cdot\\text{s}$. Vitamins: Vit A deficiency (Night blindness), Vit B1 (Beriberi), Vit C (Scurvy), Vit D (Rickets), Vit K (non-clotting of blood)."
}
};

// === TOOLKIT STATIC DATA (INLINE COMPILED) ===
const TOOLKIT_STATIC_DATA = {
  quant: [
  {
    "title": "Percentage & Product Constancy",
    "content": "### ⚖️ Product Constancy Rule\n\nIf a value increases by x%, the decrease required to restore the original value is:\n`[x / (100 + x)] × 100%`\n\n| Fraction | Percentage | Fraction | Percentage |\n| --- | --- | --- | --- |\n| 1/2 | 50.00% | 1/8 | 12.50% |\n| 1/3 | 33.33% | 1/9 | 11.11% |\n| 1/4 | 25.00% | 1/10 | 10.00% |\n| 1/5 | 20.00% | 1/11 | 9.09% |\n| 1/6 | 16.67% | 1/12 | 8.33% |\n| 1/7 | 14.28% | 1/16 | 6.25% |"
  },
  {
    "title": "Profit, Loss & Successive Discounts",
    "content": "### 🏷️ CP to MP Ratio\n\nCP / MP = (100 - d%) / (100 + p%)\n\n### 📉 Net Discount\n\n(d₁ + d₂ - d₁d₂/100)%\n\n### ⚖️ Faulty Weight Shortcut\n\n- Formula: `Profit % = [Error / (True Weight - Error)] × 100%`\n\n- Example: 900g instead of 1kg → `[100 / 900] × 100% = 11.11%`"
  },
  {
    "title": "Simple & Compound Interest",
    "content": "| Duration | CI & SI Difference Formula |\n| --- | --- |\n| 2 Years Diff | Diff = P × (R / 100)² |\n| 3 Years Diff | Diff = [P × R² × (300 + R)] / 100³ |\n\n### 🏦 Effective CI Rates (2 Years)\n\n5% → 10.25%\n10% → 21%\n15% → 32.25%\n20% → 44%"
  },
  {
    "title": "Algebraic Identities & Roots",
    "content": "$a^3+b^3+c^3 - 3abc = (a+b+c)(a^2+b^2+c^2 - ab - bc - ca) = \\frac{1}{2}(a+b+c)[(a-b)^2 + (b-c)^2 + (c-a)^2]$. If $a+b+c=0$, then $a^3+b^3+c^3 = 3abc$. Reciprocal: If $x + \\frac{1}{x} = k$, then $x^2 + \\frac{1}{x^2} = k^2 - 2$, and $x^3 + \\frac{1}{x^3} = k^3 - 3k$."
  },
  {
    "title": "Geometry Centers & Theorems",
    "content": "| Triangle Center | Angle Formulas & Properties |\n| --- | --- |\n| Centroid (G) | Divides median in ratio 2:1 |\n| Incenter (I) | ∠BIC = 90° + ∠A/2 | Inradius r = (P+B-H)/2 |\n| Circumcenter (C) | ∠BOC = 2 × ∠A | Circumradius R = H/2 |\n| Orthocenter (O) | ∠BOC = 180° - ∠A |\n\n### ⭕ High-Yield Circle Theorems\n\n- `PT² = PA × PB`\n\n- `AB² + AC² = 2(AD² + BD²)`"
  },
  {
    "title": "Mensuration (3D Surfaces & Volumes)",
    "content": "**Frustum of Cone**: Volume $= \\frac{1}{3}\\pi h(R^2 + r^2 + Rr)$, Curved Area $= \\pi l(R+r)$ where $l = \\sqrt{h^2 + (R-r)^2}$. **Sphere**: Volume $= \\frac{4}{3}\\pi R^3$, Area $= 4\\pi R^2$. **Pyramid**: Volume $= \\frac{1}{3} \\times \\text{Base Area} \\times \\text{Height}$, Lateral Area $= \\frac{1}{2} \\times \\text{Base Perimeter} \\times \\text{Slant Height}$."
  },
  {
    "title": "Time, Speed, Distance & Boats",
    "content": "Average speed for same distances = $\\frac{2xy}{x+y}$. Relative speed: opposite direction $= S_1 + S_2$, same direction $= |S_1 - S_2|$. Upstream Boat Speed $= U - V$, Downstream Speed $= U + V$, where $U$ is boat speed in still water and $V$ is stream speed. Distance formula: $D = \\text{Speed Difference} \\times \\frac{T_1 \\times T_2}{T_1 - T_2}$ or $D = \\frac{S_1 S_2}{S_1 - S_2} \\times \\text{Time Diff}$."
  },
  {
    "title": "Time & Work Equivalence",
    "content": "Formula: $M_1 D_1 H_1 E_1 / W_1 = M_2 D_2 H_2 E_2 / W_2$ (Men, Days, Hours, Efficiency, Work). If A does work in $x$ days and B in $y$ days, together they take $\\frac{xy}{x+y}$ days. Negative work (Pipes & Cistern): Leak draining capacity is subtracted from inlet capacity."
  },
  {
    "title": "Trigonometric Values &amp; Formulas Table",
    "content": "| Ratio | 0° | 30° | 45° | 60° | 90° |\n| --- | --- | --- | --- | --- | --- |\n| sin θ | 0 | 1/2 | 1/√2 | √3/2 | 1 |\n| cos θ | 1 | √3/2 | 1/2 | 1/√2 | 0 |\n| tan θ | 0 | 1/√3 | 1 | √3 | Undef |\n| cosec θ | Undef | 2 | √2 | 2/√3 | 1 |\n| sec θ | 1 | 2/√3 | √2 | 2 | Undef |\n| cot θ | Undef | √3 | 1 | 1/√3 | 0 |\n\n### 📐 Core Identities & Complementary Relations\n\n• **Basic Identities:** $sin^2\theta + cos^2\theta = 1$ | $1 + \tan^2\theta = sec^2\theta$ | $1 + cot^2\theta = \text{cosec}^2\theta$\n\n• **Complementary (If A+B=90°):** $sin A = cos B$ | $\tan A \tan B = 1$ | $sin^2 A + sin^2 B = 1$\n\n• **Min/Max limits:** For $asin\theta + bcos\theta$, Max $= sqrt{a^2+b^2}$ | Min $= -sqrt{a^2+b^2}$\n\n• **Height & Distance Triangles:** 30°-60°-90° $\rightarrow 1 : sqrt{3} : 2$ | 45°-45°-90° $\rightarrow 1 : 1 : sqrt{2}$"
  },
  {
    "title": "Coordinate Geometry",
    "content": "Distance between $(x_1, y_1)$ and $(x_2, y_2) = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$. Section formula (internal division): $(x, y) = (\\frac{m x_2 + n x_1}{m+n}, \\frac{m y_2 + n y_1}{m+n})$. Slope of line $m = \\frac{y_2-y_1}{x_2-x_1}$. If parallel: $m_1 = m_2$; if perpendicular: $m_1 m_2 = -1$. Area of triangle $= \\frac{1}{2}|x_1(y_2-y_3) + x_2(y_3-y_1) + x_3(y_1-y_2)|$."
  }
],
  grammar: [
  {
    "title": "Subject-Verb Agreement Core Cases",
    "content": "If two subjects are joined by *along with, together with, in addition to, as well as, accompanied by*, the verb agrees with the **First Subject**. If joined by *neither... nor, either... or, not only... but also*, the verb agrees with the **Nearest Subject**. Singular verbs follow expressions like *each of, either of, neither of, one of* + plural noun (e.g., \"Each of the boys has *[not have]* completed his work\")."
  },
  {
    "title": "Conditional Clauses Structure",
    "content": "| Conditional Type | If-Clause Tense | Main Clause Tense |\n| --- | --- | --- |\n| Type 1 (Real) | Present Simple | Will/Can + V1 |\n| Type 2 (Unreal) | Past Simple | Would + V1 |\n| Type 3 (Impossible) | Past Perfect | Would have + V3 |\n\n### 💡 Pro Grammar Tip\n\nIn imaginary/unreal conditions, always use \"were\" regardless of subject (e.g., \"If I *were* you...\"). Never use \"will/would\" in the *if-clause*."
  },
  {
    "title": "Active / Passive Transformations",
    "content": "Passive of imperative sentence \"Do it\" = \"Let it be done\" or \"You are ordered to do it.\" Modals: \"She can play cricket\" $\\rightarrow$ \"Cricket can be played by her.\" Prepositions do not vanish: \"He laughed at me\" $\\rightarrow$ \"I was laughed at by him.\" For transitive verbs only. Interrogative active: \"Who did this?\" $\\rightarrow$ \"By whom was this done?\""
  },
  {
    "title": "Direct & Indirect Speech Rules",
    "content": "Tense shifts (if reporting verb is in past): Present Simple $\\rightarrow$ Past Simple; Present Perfect $\\rightarrow$ Past Perfect; Past Simple $\\rightarrow$ Past Perfect. Pronoun shift formula: **SON** (1st person subject, 2nd person object, 3rd person no change). Questions: Reporting verb \"said to\" changes to \"asked\". No conjunction \"that\" is used for wh-questions; use \"if/whether\" for yes/no questions."
  },
  {
    "title": "Plural vs Singular Noun Traps",
    "content": "**Plural in form, singular in use**: *Mathematics, Physics, News, Politics, Billiards, Gallows, Innings* (always take a singular verb). **Singular in form, plural in use**: *Cattle, Gentry, Clergy, Poultry, Peasantry, People, Police* (always take a plural verb; e.g., \"Cattle are grazing *[not is grazing]*\"). **Uncountable nouns**: *Scenery, Furniture, Advice, Information, Luggage, Hair* (never take plural forms or \"a/an\")."
  },
  {
    "title": "Pronoun Order & Cases",
    "content": "When multiple persons are in one sentence, normal order is **Second Person (2) $\\rightarrow$ Third Person (3) $\\rightarrow$ First Person (1)** (e.g., \"You, he and I are study partners\"). If confessing a mistake or guilt, the order becomes **1 $\\rightarrow$ 2 $\\rightarrow$ 3** (e.g., \"I, you and he committed the error\"). Objective case follow prepositions and \"let\" (e.g., \"Between you and me *[not I]*\", \"Let him and me *[not I]* go\")."
  },
  {
    "title": "Fixed Prepositions Combinations",
    "content": "*Abstain from* (not of) • *Proficient in* • *Accused of* • *Comply with* • *Different from* (not than) • *Congratulate on* (not for) • *Refrain from* • *Prevent from* • *Key to* success • *Aim at* • *Deprived of* • *Adapted to* environment."
  }
],
  reasoning: [
  {
    "title": "Alphabet Code Map (EJOTY)",
    "content": "Memorize position blocks: E(5), J(10), O(15), T(20), Y(25). Opposite alphabet pairs sum is always **27** (A+Z = 27, B+Y = 27). Mnemonic reverse pairs: A-Z (Azhar), B-Y (Boy), C-X (Crux), D-W (Dew), E-V (Love/Even), G-T (G.T. Road), H-S (High School), I-R (Indian Railways), K-P (K.P. Thakur), L-O (Love), M-N (Man).\n\n| A | B | C | D | E | F | G | H | I | J | K | L | M |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |\n| 26 | 25 | 24 | 23 | 22 | 21 | 20 | 19 | 18 | 17 | 16 | 15 | 14 |\n| Z | Y | X | W | V | U | T | S | R | Q | P | O | N |\n\n| N | O | P | Q | R | S | T | U | V | W | X | Y | Z |\n| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n| 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 |\n| 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 |\n| M | L | K | J | I | H | G | F | E | D | C | B | A |"
  },
  {
    "title": "Clock Hands Angle Equation",
    "content": "Angle between Hour hand and Minute hand $= |30H - \\frac{11}{2}M|$ degrees. In 1 hour, hour hand travels 30° ($0.5^\\circ$ per minute) and minute hand travels 360° ($6^\\circ$ per minute). Relative speed is $5.5^\\circ$ per minute. Hands coincide every $65\\frac{5}{11}$ minutes."
  },
  {
    "title": "Calendar Odd Days Rules",
    "content": "Normal year $= 365 \\text{ days} = 52 \\text{ weeks} + 1 \\text{ odd day}$. Leap year $= 366 \\text{ days} = 52 \\text{ weeks} + 2 \\text{ odd days}$. Centenary leap years must be divisible by 400 (1600, 2000 are leap; 1700, 1800, 1900 are normal). Month codes for ordinary year: Jan(0), Feb(3), Mar(3), Apr(6), May(1), Jun(4), Jul(6), Aug(2), Sep(5), Oct(0), Nov(3), Dec(5)."
  },
  {
    "title": "Syllogism Truth Matrix",
    "content": "\"Only a few A are B\" implies: **Some A are B** AND **Some A are NOT B**. Possibility cases: A conclusion stating \"All A can be B is a possibility\" is false (since some A must not be B), but \"All B can be A is a possibility\" is true."
  },
  {
    "title": "Direction Sense Shadows & Triplets",
    "content": "At sunrise, shadow is always towards **West**. At sunset, shadow is always towards **East**. No shadow at 12:00 Noon. Shortcuts: Memorize Pythagorean triplets to find shortest distance instantly: (3,4,5), (5,12,13), (8,15,17), (7,24,25), (9,40,41), (20,21,29)."
  },
  {
    "title": "Dice Closed & Open Rules",
    "content": "Standard Dice: Sum of opposite faces is always **7** (1 opposite 6, 2 opposite 5, 3 opposite 4). Ordinary Dice: Sum of adjacent faces can be 7. Closed Dice Rule: If two positions of a single dice have one common face in the same position, then the remaining faces in the same positions are opposite to each other."
  }
],
  computer: [
  {
    "title": "Keyboard Shortcut Commands",
    "content": "Close Program: **Alt + F4**\nTask Manager: **Ctrl + Shift + Esc**\nLock Windows: **Win + L**\nProperties of selected: **Alt + Enter**\nSwitch open apps: **Alt + Tab**\nRun utility: **Win + R**"
  },
  {
    "title": "MS Excel Formulas & Cell Referencing",
    "content": "**References**: Relative (A1), Absolute ($A$1 - remains fixed when copy pasted), Mixed ($A1 or A$1). • **Formulas**: VLOOKUP(value, table, col, match), CONCATENATE(), COUNTIF(range, criteria), IF(test, true_val, false_val)."
  },
  {
    "title": "Internet Protocols & Network Port Mappings",
    "content": "HTTP (Web): **Port 80**\nHTTPS (Secure): **Port 443**\nFTP (Files): **Port 21**\nSMTP (Email Send): **Port 25**\nDNS (Domain Resolv): **Port 53**\nSSH (Sec Shell): **Port 22**"
  },
  {
    "title": "Cybersecurity: Malwares & Safeguards",
    "content": "**Trojans**: Disguised as legitimate software. • **Worms**: Self-replicating programs that travel over networks without host files. • **Ransomware**: Encrypts system data, demanding payment. • **Firewall**: Moniters incoming/outgoing traffic based on security rules."
  }
],
  laws: [
  {
    "title": "Quantitative Aptitude",
    "content": "Fixed\n**Centroid Ratio:** Median division is always $2:1$ from vertex.\n\nFixed\n**Right Triangle Radii:** Inradius is always $\\frac{a+b-c}{2}$; Circumradius is always $\\frac{c}{2}$.\n\nFixed\n**HCF-LCM Relation:** Product of two numbers $A \\times B$ is always $\\text{HCF} \\times \\text{LCM}$.\n\n**Center Angles:** BIC is $90^\\circ + \\frac{A}{2}$ (Incenter), $180^\\circ - A$ (Orthocenter), $2A$ (Circumcenter).\n\n**Interest Rates:** Simple Interest remains constant year-on-year; Compound Interest compounds progressively."
  },
  {
    "title": "Reasoning & Logic",
    "content": "Fixed\n**Standard Dice:** Sum of opposite faces is always exactly $7$.\n\nFixed\n**Alphabet Sum:** Position sum of any letter and its opposite letter is always $27$ (e.g. A + Z = 27).\n\n**Leap Year Odd Days:** 2 odd days if divisible by 4 (or 400 for century years), else 1 odd day.\n\n**Family Tree Genders:** Gender of a sibling or child is conditional on explicit statements (cannot assume from names).\n\n**Clock Hand Relative Speed:** Always $5.5^\\circ/\\text{minute}$ (calculated from differences of hand motions)."
  },
  {
    "title": "English Grammar",
    "content": "Fixed\n**Imaginary Clauses:** Always use the verb **were** regardless of singular/plural subject (e.g., \"If I were...\").\n\nFixed\n**Objective Case:** Objective pronouns (him, me, us) always follow \"between\" or \"let\".\n\n**Subject Concord:** Verb agrees with **Subject 1** for *as well as/along with*; but agrees with **Nearest Subject** for *either... or/neither... nor*.\n\n**Tense Shifts:** Voice/Narration changes are conditional on the active reporting verb tense (Past vs Present)."
  },
  {
    "title": "Computer & Science",
    "content": "Fixed\n**Port Numbers:** Fixed protocol standards (HTTP=80, HTTPS=443, SMTP=25, FTP=21).\n\nFixed\n**Excel Absolute Reference:** Cell referencing with `$` symbols (e.g. `$A$1`) never shifts when copy-pasting.\n\n**Excel Relative Reference:** Cell referencing without `$` symbols (e.g. `A1`) updates dynamically relative to destination.\n\n**Science Constants:** Acceleration due to gravity $g$ is $9.8 \\text{ m/s}^2$ on Earth but changes depending on altitude/planet."
  }
],
  patterns: [
  {
    "title": "Quantitative Aptitude Core Strategy",
    "content": "**Arithmetic (40-50%):** Percentage (Direct & successive), Profit & Loss (CP/MP ratio, faulty weights), Average, SI & CI (2/3 yr difference), and Mixture & Alligation.\n**Algebra:** Linear equations (2 variables), Quadratic roots/coefficients, Algebraic identities (like $x+1/x=k$), and Surds/Indices.\n**Geometry:** Master triangle properties (centers, circumradius, inradius equations) instead of spending days on complex proofs.\n**Mensuration:** Rotating shapes (Cube, Cuboid, Cone, Sphere, Hemisphere). Learn formulas cold.\n\n### Visual Reference Sheets:\n\n[** Topic Pyramid](ssc_patterns/quant_topic_pyramid.jpg)\n[** Arithmetic Pillars](ssc_patterns/quant_arithmetic_core_pillars.jpg)\n[** Algebra Targets](ssc_patterns/quant_algebra_core_targets.jpg)\n[** Geometry Properties](ssc_patterns/quant_geometry_properties_strategy.jpg)"
  },
  {
    "title": "General Intelligence &amp; Reasoning",
    "content": "**Series (Number & Alphabet):** Requires pattern recognition practice (do 200 questions). Jumps, alternations, prime numbers, etc.\n**Coding-Decoding:** Letter shifts, alphabetical position, and number coding rules. Looks complex but is highly logical.\n**Direction & Blood Relations:** Always draw tree diagrams and paths. Solve in under 2 minutes combined.\n**Non-Verbal Reasoning:** Mirror image (left-right flip), Water image (top-bottom flip), Paper folding, Embedded figures. Zero memorization, only spatial thinking.\n\n### Visual Reference Sheets:\n\n[** Series Patterns](ssc_patterns/reasoning_series_patterns.jpg)\n[** Coding-Decoding](ssc_patterns/reasoning_coding_decoding.jpg)\n[** Direction & Family](ssc_patterns/reasoning_direction_blood_relations.jpg)\n[** Floor/Box Puzzles](ssc_patterns/reasoning_floor_box_puzzles.jpg)"
  },
  {
    "title": "English Language &amp; Comprehension",
    "content": "**The Grammar Test:** English score is heavily dependent on learning 8 core pillars (Subject-Verb agreement, Tenses, Pronouns, Voice, Narration, Prepositions, Articles, Conjunctions).\n**Error Detection:** Mechanical. SSC hides errors in 5 places: Articles, Tenses, Pronouns, Prepositions, and Subject-Verb agreement.\n**Cloze Test & Passages:** Cloze test is 80% grammar context. Passages are straightforward (not literary masterpieces)—read slowly, mark details, answer directly.\n**Vocabulary:** Master the PYQ bullseye first (clear preferences and repeating patterns). Do not blindly memorize random words.\n\n### Visual Reference Sheets:\n\n[** Grammar Weight](ssc_patterns/english_biggest_shortcut.jpg)\n[** Score Pillars](ssc_patterns/english_score_8_pillars.jpg)\n[** Error Detection](ssc_patterns/english_error_detection_mechanical.jpg)\n[** Cloze Test](ssc_patterns/english_cloze_comprehension.jpg)"
  },
  {
    "title": "General Awareness (GK/GS)",
    "content": "**Ancient & Medieval History:** Buddhism & Jainism (councils, teachings), Mauryan Empire (Ashoka, edicts, Kautilya), Gupta Empire (literature, science), and Mughals (Akbar's Mansabdari/Din-i-Ilahi, Jizya tax rules). Ignore obscure regional dates.\n**Modern History:** INC Swadeshi, Quit India movements, important personalities (Gandhi, Bose, Tilak, Bhagat), Acts (1773-1935), and Revolt of 1857 (causes, leaders).\n**Polity:** Fundamental Rights, Parliament (bills, sessions, committees), DPSP, and Amendments (42nd, 44th, 73rd, 74th, 86th).\n**Economics & Current Affairs:** GDP vs GNP, RBI rate mechanics (Repo, Reverse Repo, CRR, SLR). Current affairs focus strictly on 5 areas: Awards, Govt Schemes, Sports, Days, and Int. Orgs.\n\n### Visual Reference Sheets:\n\n[** History Core](ssc_patterns/history_ancient_medieval_clusters.jpg)\n[** Modern History](ssc_patterns/history_modern_big_6_checklist.jpg)\n[** Polity Goldmine](ssc_patterns/polity_predictable_goldmine.jpg)\n[** Current Affairs](ssc_patterns/current_affairs_key_categories.jpg)"
  }
],
  tables: [
  {
    "title": "Multiplication Tables 1–10",
    "content": "| × | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n|---|---|---|---|---|---|---|---|---|---|---|\n| **1** | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |\n| **2** | 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 |\n| **3** | 3 | 6 | 9 | 12 | 15 | 18 | 21 | 24 | 27 | 30 |\n| **4** | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 36 | 40 |\n| **5** | 5 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 |\n| **6** | 6 | 12 | 18 | 24 | 30 | 36 | 42 | 48 | 54 | 60 |\n| **7** | 7 | 14 | 21 | 28 | 35 | 42 | 49 | 56 | 63 | 70 |\n| **8** | 8 | 16 | 24 | 32 | 40 | 48 | 56 | 64 | 72 | 80 |\n| **9** | 9 | 18 | 27 | 36 | 45 | 54 | 63 | 72 | 81 | 90 |\n| **10** | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100 |"
  },
  {
    "title": "Multiplication Tables 11–20",
    "content": "| n | ×1 | ×2 | ×3 | ×4 | ×5 | ×6 | ×7 | ×8 | ×9 | ×10 | ×11 | ×12 |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|\n| **11** | 11 | 22 | 33 | 44 | 55 | 66 | 77 | 88 | 99 | 110 | 121 | 132 |\n| **12** | 12 | 24 | 36 | 48 | 60 | 72 | 84 | 96 | 108 | 120 | 132 | 144 |\n| **13** | 13 | 26 | 39 | 52 | 65 | 78 | 91 | 104 | 117 | 130 | 143 | 156 |\n| **14** | 14 | 28 | 42 | 56 | 70 | 84 | 98 | 112 | 126 | 140 | 154 | 168 |\n| **15** | 15 | 30 | 45 | 60 | 75 | 90 | 105 | 120 | 135 | 150 | 165 | 180 |\n| **16** | 16 | 32 | 48 | 64 | 80 | 96 | 112 | 128 | 144 | 160 | 176 | 192 |\n| **17** | 17 | 34 | 51 | 68 | 85 | 102 | 119 | 136 | 153 | 170 | 187 | 204 |\n| **18** | 18 | 36 | 54 | 72 | 90 | 108 | 126 | 144 | 162 | 180 | 198 | 216 |\n| **19** | 19 | 38 | 57 | 76 | 95 | 114 | 133 | 152 | 171 | 190 | 209 | 228 |\n| **20** | 20 | 40 | 60 | 80 | 100 | 120 | 140 | 160 | 180 | 200 | 220 | 240 |"
  },
  {
    "title": "Multiplication Tables 21–30",
    "content": "| n | ×1 | ×2 | ×3 | ×4 | ×5 | ×6 | ×7 | ×8 | ×9 | ×10 |\n|---|---|---|---|---|---|---|---|---|---|---|\n| **21** | 21 | 42 | 63 | 84 | 105 | 126 | 147 | 168 | 189 | 210 |\n| **22** | 22 | 44 | 66 | 88 | 110 | 132 | 154 | 176 | 198 | 220 |\n| **23** | 23 | 46 | 69 | 92 | 115 | 138 | 161 | 184 | 207 | 230 |\n| **24** | 24 | 48 | 72 | 96 | 120 | 144 | 168 | 192 | 216 | 240 |\n| **25** | 25 | 50 | 75 | 100 | 125 | 150 | 175 | 200 | 225 | 250 |\n| **26** | 26 | 52 | 78 | 104 | 130 | 156 | 182 | 208 | 234 | 260 |\n| **27** | 27 | 54 | 81 | 108 | 135 | 162 | 189 | 216 | 243 | 270 |\n| **28** | 28 | 56 | 84 | 112 | 140 | 168 | 196 | 224 | 252 | 280 |\n| **29** | 29 | 58 | 87 | 116 | 145 | 174 | 203 | 232 | 261 | 290 |\n| **30** | 30 | 60 | 90 | 120 | 150 | 180 | 210 | 240 | 270 | 300 |"
  },
  {
    "title": "Multiplication Tables 31–40",
    "content": "| n | ×1 | ×2 | ×3 | ×4 | ×5 | ×6 | ×7 | ×8 | ×9 | ×10 |\n|---|---|---|---|---|---|---|---|---|---|---|\n| **31** | 31 | 62 | 93 | 124 | 155 | 186 | 217 | 248 | 279 | 310 |\n| **32** | 32 | 64 | 96 | 128 | 160 | 192 | 224 | 256 | 288 | 320 |\n| **33** | 33 | 66 | 99 | 132 | 165 | 198 | 231 | 264 | 297 | 330 |\n| **34** | 34 | 68 | 102 | 136 | 170 | 204 | 238 | 272 | 306 | 340 |\n| **35** | 35 | 70 | 105 | 140 | 175 | 210 | 245 | 280 | 315 | 350 |\n| **36** | 36 | 72 | 108 | 144 | 180 | 216 | 252 | 288 | 324 | 360 |\n| **37** | 37 | 74 | 111 | 148 | 185 | 222 | 259 | 296 | 333 | 370 |\n| **38** | 38 | 76 | 114 | 152 | 190 | 228 | 266 | 304 | 342 | 380 |\n| **39** | 39 | 78 | 117 | 156 | 195 | 234 | 273 | 312 | 351 | 390 |\n| **40** | 40 | 80 | 120 | 160 | 200 | 240 | 280 | 320 | 360 | 400 |"
  },
  {
    "title": "Squares: 1² to 30²",
    "content": "| n | n² | n | n² | n | n² |\n|---|---|---|---|---|---|\n| 1 | **1** | 11 | **121** | 21 | **441** |\n| 2 | **4** | 12 | **144** | 22 | **484** |\n| 3 | **9** | 13 | **169** | 23 | **529** |\n| 4 | **16** | 14 | **196** | 24 | **576** |\n| 5 | **25** | 15 | **225** | 25 | **625** |\n| 6 | **36** | 16 | **256** | 26 | **676** |\n| 7 | **49** | 17 | **289** | 27 | **729** |\n| 8 | **64** | 18 | **324** | 28 | **784** |\n| 9 | **81** | 19 | **361** | 29 | **841** |\n| 10 | **100** | 20 | **400** | 30 | **900** |\n\n💡 **Pattern Trick:** (a+b)² = a² + 2ab + b²  →  e.g. 23² = (20+3)² = 400 + 120 + 9 = **529**"
  },
  {
    "title": "Cubes: 1³ to 20³",
    "content": "| n | n³ | n | n³ |\n|---|---|---|---|\n| 1 | **1** | 11 | **1,331** |\n| 2 | **8** | 12 | **1,728** |\n| 3 | **27** | 13 | **2,197** |\n| 4 | **64** | 14 | **2,744** |\n| 5 | **125** | 15 | **3,375** |\n| 6 | **216** | 16 | **4,096** |\n| 7 | **343** | 17 | **4,913** |\n| 8 | **512** | 18 | **5,832** |\n| 9 | **729** | 19 | **6,859** |\n| 10 | **1,000** | 20 | **8,000** |\n\n💡 **Unit Digit Trick:** 1→1, 2→8, 3→7, 4→4, 5→5, 6→6, 7→3, 8→2, 9→9, 0→0"
  },
  {
    "title": "Trig Table — sin, cos, tan (0° to 90°)",
    "content": "| Angle | sin θ | cos θ | tan θ |\n|---|---|---|---|\n| **0°** | 0 | 1 | 0 |\n| **30°** | 1/2 | √3/2 | 1/√3 |\n| **45°** | 1/√2 | 1/√2 | 1 |\n| **60°** | √3/2 | 1/2 | √3 |\n| **90°** | 1 | 0 | Not Defined |\n\n💡 **sin Memory Trick:** sin 0°,30°,45°,60°,90° = √0/2, √1/2, √2/2, √3/2, √4/2 = **0, 1/2, 1/√2, √3/2, 1**\n\ncos θ = sin(90° − θ)  →  just **reverse** the sin column!"
  },
  {
    "title": "Trig Table — cosec, sec, cot (0° to 90°)",
    "content": "| Angle | cosec θ | sec θ | cot θ |\n|---|---|---|---|\n| **0°** | Not Defined | 1 | Not Defined |\n| **30°** | 2 | 2/√3 | √3 |\n| **45°** | √2 | √2 | 1 |\n| **60°** | 2/√3 | 2 | 1/√3 |\n| **90°** | 1 | Not Defined | 0 |\n\n💡 **Reciprocal Relations:**\n- cosec θ = 1/sin θ\n- sec θ = 1/cos θ\n- cot θ = 1/tan θ = cos θ/sin θ"
  },
  {
    "title": "Trig Identities & Complementary Angles",
    "content": "### Pythagorean Identities\n| Identity |\n|---|\n| sin²θ + cos²θ = 1 |\n| 1 + tan²θ = sec²θ |\n| 1 + cot²θ = cosec²θ |\n\n### Complementary Angle Rules (A + B = 90°)\n| sin(90°−θ) = cos θ | cos(90°−θ) = sin θ |\n|---|---|\n| tan(90°−θ) = cot θ | cot(90°−θ) = tan θ |\n| sec(90°−θ) = cosec θ | cosec(90°−θ) = sec θ |\n\n### Min / Max Values\n| Expression | Min | Max |\n|---|---|---|\n| a·sinθ + b·cosθ | −√(a²+b²) | √(a²+b²) |\n| sin²θ + cosec²θ | 2 | ∞ |\n| cos²θ + sec²θ | 2 | ∞ |\n\n### Special Angle Triangles\n- **30°-60°-90°** → sides in ratio **1 : √3 : 2**\n- **45°-45°-90°** → sides in ratio **1 : 1 : √2**"
  },
  {
    "title": "Pythagorean Triplets",
    "content": "| Base Triplet (a, b, c) | ×2 | ×3 | ×4 | ×5 |\n|---|---|---|---|---|\n| **(3, 4, 5)** | 6,8,10 | 9,12,15 | 12,16,20 | 15,20,25 |\n| **(5, 12, 13)** | 10,24,26 | 15,36,39 | 20,48,52 | 25,60,65 |\n| **(8, 15, 17)** | 16,30,34 | 24,45,51 | 32,60,68 | — |\n| **(7, 24, 25)** | 14,48,50 | 21,72,75 | — | — |\n| **(9, 40, 41)** | 18,80,82 | — | — | — |\n| **(11, 60, 61)** | — | — | — | — |\n| **(12, 35, 37)** | 24,70,74 | — | — | — |\n| **(20, 21, 29)** | 40,42,58 | — | — | — |\n| **(28, 45, 53)** | — | — | — | — |\n| **(33, 56, 65)** | — | — | — | — |\n\n💡 **Verification:** a² + b² = c²  →  e.g. 3²+4² = 9+16 = 25 = 5² ✓"
  },
  {
    "title": "Fraction ↔ Percentage (Complete Table)",
    "content": "| Fraction | % Value | Fraction | % Value | Fraction | % Value |\n|---|---|---|---|---|---|\n| 1/2 | **50%** | 1/8 | **12.5%** | 3/8 | **37.5%** |\n| 1/3 | **33.33%** | 3/4 | **75%** | 5/8 | **62.5%** |\n| 2/3 | **66.67%** | 1/5 | **20%** | 7/8 | **87.5%** |\n| 1/4 | **25%** | 2/5 | **40%** | 1/9 | **11.11%** |\n| 1/6 | **16.67%** | 3/5 | **60%** | 1/10 | **10%** |\n| 5/6 | **83.33%** | 4/5 | **80%** | 3/10 | **30%** |\n| 1/7 | **14.28%** | 1/11 | **9.09%** | 7/10 | **70%** |\n| 1/12 | **8.33%** | 1/15 | **6.67%** | 1/16 | **6.25%** |\n\n💡 **Quick Recall Pattern:**\n- Thirds: 33.33%, 66.67%\n- Fourths: 25%, 50%, 75%\n- Fifths: 20%, 40%, 60%, 80%\n- Eighths: 12.5%, 25%, 37.5%, 50%, 62.5%, 75%, 87.5%"
  },
  {
    "title": "HCF & LCM — Key Sets",
    "content": "### Commonly Tested LCM Values\n| Numbers | LCM |\n|---|---|\n| 2, 3, 4 | **12** |\n| 3, 4, 6 | **12** |\n| 4, 6, 8 | **24** |\n| 3, 6, 9 | **18** |\n| 5, 10, 15 | **30** |\n| 6, 9, 12 | **36** |\n| 8, 12, 16 | **48** |\n| 10, 12, 15 | **60** |\n| 8, 12, 15 | **120** |\n| 18, 24, 36 | **72** |\n| 20, 25, 30 | **300** |\n\n### HCF Rule\n- HCF of (ka, kb, kc) = k × HCF(a, b, c)\n- LCM × HCF = Product of two numbers (for pairs only)\n- **Shortcut:** For 3+ numbers — HCF divides all; test by divisibility"
  },
  {
    "title": "Alphabet Position Table (A–Z)",
    "content": "| Letter | Pos | Rev | Opp | Letter | Pos | Rev | Opp |\n|---|---|---|---|---|---|---|---|\n| A | 1 | 26 | Z | N | 14 | 13 | M |\n| B | 2 | 25 | Y | O | 15 | 12 | L |\n| C | 3 | 24 | X | P | 16 | 11 | K |\n| D | 4 | 23 | W | Q | 17 | 10 | J |\n| E | 5 | 22 | V | R | 18 | 9 | I |\n| F | 6 | 21 | U | S | 19 | 8 | H |\n| G | 7 | 20 | T | T | 20 | 7 | G |\n| H | 8 | 19 | S | U | 21 | 6 | F |\n| I | 9 | 18 | R | V | 22 | 5 | E |\n| J | 10 | 17 | Q | W | 23 | 4 | D |\n| K | 11 | 16 | P | X | 24 | 3 | C |\n| L | 12 | 15 | O | Y | 25 | 2 | B |\n| M | 13 | 14 | N | Z | 26 | 1 | A |\n\n💡 **Pos + Rev = 27** always. **Opposite** = letter at position (27 − pos)."
  }
]
};

// Dynamically inject Computer Knowledge targets into PLAN_DATA
const COMPUTER_TARGET_MAP = {
  3: "c-1-1",
  6: "c-1-2",
  9: "c-1-3",
  12: "c-1-4",
  15: "c-2-1",
  18: "c-2-2",
  21: "c-2-3",
  24: "c-2-4",
  27: "c-3-1",
  30: "c-3-2",
  33: "c-3-3",
  35: "c-4-1",
  37: "c-4-2",
  39: "c-4-3"
};

if (typeof PLAN_DATA !== 'undefined') {
  PLAN_DATA.forEach(dayItem => {
    const compTarget = COMPUTER_TARGET_MAP[dayItem.day];
    if (compTarget) {
      if (!dayItem.targets.includes(compTarget)) {
        dayItem.targets.push(compTarget);
      }
    }
  });
}
