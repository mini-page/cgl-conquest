// === STATE & DATABASE MODULE ===
/* ==========================================================================
   SSC CGL Rank-Maker Dashboard - Application Logic (Tailwind Core Edition)
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
      "a": 0
    },
    {
      "q": "Antonym of 'ALACRITY':",
      "o": [
        "Enthusiasm",
        "Apathy",
        "Swiftness",
        "Zeal"
      ],
      "a": 1
    },
    {
      "q": "Find the correctly spelled word:",
      "o": [
        "Committee",
        "Comitee",
        "Committe",
        "Comitte"
      ],
      "a": 0
    },
    {
      "q": "One Word Substitution: 'One who hates mankind'",
      "o": [
        "Philanthropist",
        "Misogynist",
        "Misanthrope",
        "Egotist"
      ],
      "a": 2
    },
    {
      "q": "Idiom Meaning: 'To spill the beans'",
      "o": [
        "To cook beans",
        "To reveal a secret",
        "To waste money",
        "To cause an accident"
      ],
      "a": 1
    },
    {
      "q": "Synonym of 'FUTILE':",
      "o": [
        "Fruitful",
        "Useless",
        "Productive",
        "Important"
      ],
      "a": 1
    },
    {
      "q": "Antonym of 'HOSTILE':",
      "o": [
        "Friendly",
        "Adverse",
        "Antagonistic",
        "Unkind"
      ],
      "a": 0
    },
    {
      "q": "Identify the part of speech of the underlined word: 'She runs fast.'",
      "o": [
        "Noun",
        "Adjective",
        "Adverb",
        "Verb"
      ],
      "a": 2
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
      "a": 0
    },
    {
      "q": "If 'MONKEY' is coded as 'XDJMNL', how is 'TIGER' coded?",
      "o": [
        "SDFHS",
        "QDFHS",
        "QDYTR",
        "SDFTR"
      ],
      "a": 1
    },
    {
      "q": "In a family, A is B's brother, C is A's father, D is C's mother. How is B related to D?",
      "o": [
        "Grandson",
        "Granddaughter",
        "Grandchild",
        "Daughter-in-law"
      ],
      "a": 2
    },
    {
      "q": "Select the odd one out: 27, 64, 125, 144",
      "o": [
        "27",
        "64",
        "125",
        "144"
      ],
      "a": 3
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
      "d": "easy"
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
      "d": "hard"
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
      "d": "medium"
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
      "d": "hard"
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
      "d": "hard"
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
      "d": "medium"
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
      "d": "easy"
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
      "d": "medium"
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
      "d": "medium"
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
      "d": "easy"
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
      "d": "easy"
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
      "d": "easy"
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
      "d": "medium"
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
      "d": "medium"
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
      "d": "medium"
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
      "d": "medium"
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
      "d": "hard"
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
      "d": "hard"
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
      "d": "hard"
    }
  ],
  "gk": [
    {
      "q": "River Ganga originates from which of the following glaciers?",
      "o": ["Yamunotri", "Gangotri", "Alkapuri", "Milam"],
      "a": 1,
      "d": "easy"
    },
    {
      "q": "Which river is also known as 'Dakshin Ganga' due to its length and size?",
      "o": ["Krishna", "Cauvery", "Godavari", "Mahanadi"],
      "a": 2,
      "d": "easy"
    },
    {
      "q": "On which river is the Sardar Sarovar Dam constructed?",
      "o": ["Narmada", "Tapi", "Sabarmati", "Mahi"],
      "a": 0,
      "d": "easy"
    },
    {
      "q": "Which of the following is the highest peak in the Western Ghats of India?",
      "o": ["Doda Betta", "Anamudi", "Mahendragiri", "Kalsubai"],
      "a": 1,
      "d": "medium"
    },
    {
      "q": "The Kanchenjunga peak, the third highest mountain in the world, is located in which Indian state?",
      "o": ["Uttarakhand", "Himachal Pradesh", "Sikkim", "Arunachal Pradesh"],
      "a": 2,
      "d": "medium"
    },
    {
      "q": "Which is the longest dam in India, built across the Mahanadi river in Odisha?",
      "o": ["Tehri Dam", "Bhakra Dam", "Hirakud Dam", "Nagarjuna Sagar Dam"],
      "a": 2,
      "d": "medium"
    },
    {
      "q": "Which boundary line separates the territories of India and China?",
      "o": ["Radcliffe Line", "McMahon Line", "Durand Line", "Line of Control"],
      "a": 1,
      "d": "medium"
    },
    {
      "q": "In which year did the famous Battle of Haldighati take place between Akbar and Maharana Pratap?",
      "o": ["1556", "1576", "1526", "1586"],
      "a": 1,
      "d": "hard"
    },
    {
      "q": "Who was the founder of the ancient Maurya Dynasty in India?",
      "o": ["Ashoka", "Chandragupta Maurya", "Bindusara", "Chandragupta I"],
      "a": 1,
      "d": "hard"
    },
    {
      "q": "The historic First Battle of Panipat was fought in which year?",
      "o": ["1526", "1556", "1761", "1530"],
      "a": 0,
      "d": "hard"
    },
    {
      "q": "In which year did Mahatma Gandhi lead the Dandi Salt March?",
      "o": ["1920", "1930", "1942", "1919"],
      "a": 1,
      "d": "hard"
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
    dailyRituals: { drill: false, vocab: false, ca: false, computer: false }
};

// Timer Intervals
let sessionTimerInterval = null;
let pomoTimerInterval = null;
const pomoRingCircumference = 534; // 2 * PI * 85

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
    }
}


// Load state from local storage
function loadStateFromStorage() {
    const saved = localStorage.getItem("ssc_cgl_state");
    if (saved) {
        try {
            appState = { ...appState, ...JSON.parse(saved) };
            if (!appState.weakAlerts) appState.weakAlerts = {};
            if (!appState.examName) appState.examName = "SSC CGL Tier-1";
            if (!appState.examDate) appState.examDate = "2026-08-15";
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
        appState.examName = "SSC CGL Tier-1";
        appState.examDate = "2026-08-15";
        saveStateToStorage();
    }
}

// Save state to local storage
function saveStateToStorage() {
    localStorage.setItem("ssc_cgl_state", JSON.stringify(appState));
}


// === GK STATIC DATA (INLINE COMPILED) ===
const GK_STATIC_DATA = {
  polity: [
  {
    "section": "Fundamental Rights",
    "items": [
      {
        "key": "Article 14",
        "val": "Equality before law"
      },
      {
        "key": "Article 19",
        "val": "Freedom of speech & expression"
      },
      {
        "key": "Article 21",
        "val": "Right to life & personal liberty"
      },
      {
        "key": "Article 32",
        "val": "Constitutional Remedies (Heart & Soul)"
      }
    ]
  },
  {
    "section": "Emergency Provisions",
    "items": [
      {
        "key": "Article 352",
        "val": "National Emergency"
      },
      {
        "key": "Article 356",
        "val": "President's Rule (State Emergency)"
      },
      {
        "key": "Article 360",
        "val": "Financial Emergency"
      }
    ]
  },
  {
    "section": "Important Amendments",
    "items": [
      {
        "key": "42nd Amendment",
        "val": "Mini-Constitution (added Socialist, Secular, Integrity)"
      },
      {
        "key": "44th Amendment",
        "val": "Removed 'Right to Property' from Fundamental Rights"
      },
      {
        "key": "86th Amendment",
        "val": "Right to Education (added Article 21A)"
      }
    ]
  }
],
  history: [
  {
    "period": "Ancient Era & Indus Valley Civilization",
    "battles": [
      {
        "event": "Harappa Excavation",
        "year": "1921",
        "details": "Daya Ram Sahni"
      },
      {
        "event": "Mohenjodaro Excavation",
        "year": "1922",
        "details": "R.D. Banerjee"
      }
    ]
  },
  {
    "period": "Medieval Battles",
    "battles": [
      {
        "event": "1st Battle of Tarain",
        "year": "1191",
        "details": "Prithviraj Chauhan defeats Mohammad Ghori"
      },
      {
        "event": "2nd Battle of Tarain",
        "year": "1192",
        "details": "Mohammad Ghori defeats Prithviraj Chauhan"
      },
      {
        "event": "1st Battle of Panipat",
        "year": "1526",
        "details": "Babur defeats Ibrahim Lodi (Mughal empire starts)"
      },
      {
        "event": "2nd Battle of Panipat",
        "year": "1556",
        "details": "Akbar defeats Hemu"
      },
      {
        "event": "3rd Battle of Panipat",
        "year": "1761",
        "details": "Ahmad Shah Abdali defeats Marathas"
      }
    ]
  },
  {
    "period": "British Colonial Era Battles",
    "battles": [
      {
        "event": "Battle of Plassey",
        "year": "1757",
        "details": "Robert Clive defeats Nawab Siraj-ud-Daulah"
      },
      {
        "event": "Battle of Buxar",
        "year": "1764",
        "details": "British defeat joint Mughal / Nawab alliance"
      }
    ]
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