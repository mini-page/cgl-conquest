/* ==========================================================================
   SSC CGL Rank-Maker Dashboard - Application Logic (Tailwind Core Edition)
   ========================================================================== */

// 1. SYLLABUS DATABASE
const SYLLABUS_DATA = [
    // 1. QUANTITATIVE APTITUDE
    {
        id: "q-1",
        subject: "Quantitative Aptitude",
        category: "Arithmetic",
        topic: "Percentage",
        subtopics: [
            { id: "q-1-1", name: "Basic Calculations & Fractions Conversion", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-1-2", name: "Percentage Increase/Decrease & Successive changes", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-1-3", name: "Product Constancy & Consumption-Price models", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-1-4", name: "Income-Expenditure & Population word problems", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-1-5", name: "Venn Diagram based Percentage questions", difficulty: "Hard", weightage: "Medium", effort: "Moderate" }
        ]
    },
    {
        id: "q-2",
        subject: "Quantitative Aptitude",
        category: "Arithmetic",
        topic: "Ratio & Proportion",
        subtopics: [
            { id: "q-2-1", name: "Basic Ratios, Combining & Balancing Ratios", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-2-2", name: "Proportionals (Mean, Third, Fourth Proportion)", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-2-3", name: "Incomes, Expenses & Savings Ratio problems", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-2-4", name: "Coins, Bag & Value distribution problems", difficulty: "Moderate", weightage: "Medium", effort: "Low" }
        ]
    },
    {
        id: "q-3",
        subject: "Quantitative Aptitude",
        category: "Arithmetic",
        topic: "Average",
        subtopics: [
            { id: "q-3-1", name: "Basic Average & Consecutive Numbers properties", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "q-3-2", name: "Weighted Average & Group changes (Replacement/Inclusion/Exclusion)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-3-3", name: "Average Speed word problems", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "q-3-4", name: "Advanced averages with variables (Error correction)", difficulty: "Hard", weightage: "Medium", effort: "Moderate" }
        ]
    },
    {
        id: "q-4",
        subject: "Quantitative Aptitude",
        category: "Arithmetic",
        topic: "Profit & Loss",
        subtopics: [
            { id: "q-4-1", name: "Basic Cost Price, Selling Price & Profit/Loss %", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-4-2", name: "Marked Price, Discounts & Successive Discounts", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-4-3", name: "Dishonest Dealer & Cheating weights models", difficulty: "Hard", weightage: "High", effort: "Moderate" },
            { id: "q-4-4", name: "SP of two articles same / CP same logic", difficulty: "Moderate", weightage: "High", effort: "Moderate" }
        ]
    },
    {
        id: "q-5",
        subject: "Quantitative Aptitude",
        category: "Arithmetic",
        topic: "Simple & Compound Interest",
        subtopics: [
            { id: "q-5-1", name: "Simple Interest basics & Rate/Time relations", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "q-5-2", name: "Compound Interest (Annual, Half-yearly, Quarterly)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-5-3", name: "Difference between CI and SI (2 years & 3 years)", difficulty: "Moderate", weightage: "High", effort: "Low" },
            { id: "q-5-4", name: "SI and CI Installations models", difficulty: "Hard", weightage: "Medium", effort: "High" }
        ]
    },
    {
        id: "q-6",
        subject: "Quantitative Aptitude",
        category: "Arithmetic",
        topic: "Time & Work",
        subtopics: [
            { id: "q-6-1", name: "Basic Efficiency & Days calculations (LCM Method)", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-6-2", name: "Alternate Days working schedule", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-6-3", name: "Men, Women, Boys efficiency ratio equation (MDH rule)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-6-4", name: "Pipes & Cisterns (Inlet, Outlet, Leakages)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-6-5", name: "Work & Wages division models", difficulty: "Easy", weightage: "Medium", effort: "Low" }
        ]
    },
    {
        id: "q-7",
        subject: "Quantitative Aptitude",
        category: "Arithmetic",
        topic: "Time, Speed & Distance",
        subtopics: [
            { id: "q-7-1", name: "Speed Conversions & Relative Speed concepts", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-7-2", name: "Train Crossing (Pole, Platform, Other train)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-7-3", name: "Boats & Streams (Upstream, Downstream)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-7-4", name: "Linear Races & Circular Tracks", difficulty: "Hard", weightage: "Medium", effort: "High" }
        ]
    },
    {
        id: "q-8",
        subject: "Quantitative Aptitude",
        category: "Arithmetic",
        topic: "Mixture & Alligation",
        subtopics: [
            { id: "q-8-1", name: "Basic Alligation rule on price/weight", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "q-8-2", name: "Replacement & Repeated dilution formula", difficulty: "Hard", weightage: "Medium", effort: "High" },
            { id: "q-8-3", name: "Mixing of three or more containers", difficulty: "Moderate", weightage: "Low", effort: "Moderate" }
        ]
    },
    {
        id: "q-9",
        subject: "Quantitative Aptitude",
        category: "Arithmetic",
        topic: "Partnership",
        subtopics: [
            { id: "q-9-1", name: "Simple Partnerships (Capital & Time ratio)", difficulty: "Easy", weightage: "Low", effort: "Low" },
            { id: "q-9-2", name: "Active & Sleeping partners (Salaries distribution)", difficulty: "Moderate", weightage: "Low", effort: "Moderate" }
        ]
    },
    {
        id: "q-10",
        subject: "Quantitative Aptitude",
        category: "Advanced Mathematics",
        topic: "Number System",
        subtopics: [
            { id: "q-10-1", name: "Classification of Numbers & Face/Place value", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "q-10-2", name: "Divisibility Rules (Combined 7-11-13, 11, 72, 88)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-10-3", name: "Unit Digit & Last Two Digits calculations", difficulty: "Moderate", weightage: "Medium", effort: "Moderate" },
            { id: "q-10-4", name: "Remainder Theorems (Euler, Fermat, Wilson, Chinese)", difficulty: "Hard", weightage: "High", effort: "High" },
            { id: "q-10-5", name: "Factors (Sum, Product, Odd/Even factors count)", difficulty: "Moderate", weightage: "Medium", effort: "Moderate" },
            { id: "q-10-6", name: "HCF & LCM word models & Bell ring problems", difficulty: "Easy", weightage: "High", effort: "Low" }
        ]
    },
    {
        id: "q-11",
        subject: "Quantitative Aptitude",
        category: "Advanced Mathematics",
        topic: "Algebra",
        subtopics: [
            { id: "q-11-1", name: "Algebraic Identities (Squares, Cubes, a3+b3+c3-3abc)", difficulty: "Moderate", weightage: "High", effort: "High" },
            { id: "q-11-2", name: "x + 1/x type variations & transformations", difficulty: "Easy", weightage: "High", effort: "Moderate" },
            { id: "q-11-3", name: "Linear Equations & Graphs (Parallel, Coincident lines)", difficulty: "Moderate", weightage: "Medium", effort: "Moderate" },
            { id: "q-11-4", name: "Quadratic Equations (Roots, Discriminants, Max/Min value)", difficulty: "Hard", weightage: "High", effort: "High" }
        ]
    },
    {
        id: "q-12",
        subject: "Quantitative Aptitude",
        category: "Advanced Mathematics",
        topic: "Geometry",
        subtopics: [
            { id: "q-12-1", name: "Lines, Angles & Parallel lines properties", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "q-12-2", name: "Triangles (Congruency, Similarity, Sine/Cosine rules)", difficulty: "Hard", weightage: "High", effort: "High" },
            { id: "q-12-3", name: "Triangle Centers (Incenter, Orthocenter, Centroid, Circumcenter)", difficulty: "Hard", weightage: "High", effort: "High" },
            { id: "q-12-4", name: "Circles (Chords, Tangents, Secants theorems)", difficulty: "Hard", weightage: "High", effort: "High" },
            { id: "q-12-5", name: "Polygons (Sum of Interior/Exterior angles, Diagonals)", difficulty: "Easy", weightage: "Medium", effort: "Low" }
        ]
    },
    {
        id: "q-13",
        subject: "Quantitative Aptitude",
        category: "Advanced Mathematics",
        topic: "Mensuration (2D & 3D)",
        subtopics: [
            { id: "q-13-1", name: "2D Area & Perimeter (Triangle, Quadrilaterals, Circle)", difficulty: "Easy", weightage: "High", effort: "Moderate" },
            { id: "q-13-2", name: "3D Cuboid, Cube, Cylinder, Cone (Surface Area & Volume)", difficulty: "Moderate", weightage: "High", effort: "High" },
            { id: "q-13-3", name: "Spheres & Hemispheres (Melting & Recasting)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-13-4", name: "Prism & Pyramid (Hexagonal, Triangular bases)", difficulty: "Hard", weightage: "Medium", effort: "High" },
            { id: "q-13-5", name: "Frustum of Cone (Tier 2 Focus)", difficulty: "Hard", weightage: "Medium", effort: "High" }
        ]
    },
    {
        id: "q-14",
        subject: "Quantitative Aptitude",
        category: "Advanced Mathematics",
        topic: "Trigonometry",
        subtopics: [
            { id: "q-14-1", name: "Trigonometric Ratios & Value Chart (0-90 degrees)", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-14-2", name: "Trigonometric Identities & Complementary Angles", difficulty: "Moderate", weightage: "High", effort: "High" },
            { id: "q-14-3", name: "Maximum & Minimum values of Trig expressions", difficulty: "Hard", weightage: "Medium", effort: "Moderate" },
            { id: "q-14-4", name: "Heights & Distances (Angle of Elevation/Depression)", difficulty: "Moderate", weightage: "High", effort: "Moderate" }
        ]
    },
    {
        id: "q-15",
        subject: "Quantitative Aptitude",
        category: "Advanced Mathematics",
        topic: "Statistics & Probability",
        subtopics: [
            { id: "q-15-1", name: "Mean, Median, Mode & Standard Deviation", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-15-2", name: "Basic Probability (Coins, Dice, Cards)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "q-15-3", name: "Conditional Probability & Multiplication theorem", difficulty: "Hard", weightage: "Medium", effort: "High" }
        ]
    },
    {
        id: "q-16",
        subject: "Quantitative Aptitude",
        category: "Advanced Mathematics",
        topic: "Data Interpretation",
        subtopics: [
            { id: "q-16-1", name: "Bar Graph, Line Graph analysis", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-16-2", name: "Pie Chart (Degree & Percent distributions)", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "q-16-3", name: "Histogram & Frequency Polygon", difficulty: "Moderate", weightage: "Medium", effort: "Moderate" }
        ]
    },

    // 2. GENERAL INTELLIGENCE & REASONING
    {
        id: "r-1",
        subject: "General Intelligence & Reasoning",
        category: "Verbal Reasoning",
        topic: "Coding-Decoding",
        subtopics: [
            { id: "r-1-1", name: "Letter-to-Letter Coding (Place values & Opposites)", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "r-1-2", name: "Letter-to-Number & Mixed Chinese Coding", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "r-1-3", name: "Advanced Logical pattern codings", difficulty: "Moderate", weightage: "High", effort: "Moderate" }
        ]
    },
    {
        id: "r-2",
        subject: "General Intelligence & Reasoning",
        category: "Verbal Reasoning",
        topic: "Analogy & Classification",
        subtopics: [
            { id: "r-2-1", name: "Word/GK based Analogy & Odd One Out", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "r-2-2", name: "Number & Alphabet Set-Analogies (Tough patterns)", difficulty: "Hard", weightage: "High", effort: "Moderate" }
        ]
    },
    {
        id: "r-3",
        subject: "General Intelligence & Reasoning",
        category: "Verbal Reasoning",
        topic: "Series (Number & Alphabet)",
        subtopics: [
            { id: "r-3-1", name: "Alphanumeric & Continuous Pattern Series", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "r-3-2", name: "Missing Number Series (Double diff, Squares/Cubes)", difficulty: "Hard", weightage: "High", effort: "Moderate" },
            { id: "r-3-3", name: "Wrong Number Series identification", difficulty: "Hard", weightage: "Medium", effort: "Moderate" }
        ]
    },
    {
        id: "r-4",
        subject: "General Intelligence & Reasoning",
        category: "Verbal Reasoning",
        topic: "Blood Relations",
        subtopics: [
            { id: "r-4-1", name: "Family Tree & Direct Pointer relations", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "r-4-2", name: "Coded Blood Relations (A+B means A is father)", difficulty: "Moderate", weightage: "High", effort: "Low" }
        ]
    },
    {
        id: "r-5",
        subject: "General Intelligence & Reasoning",
        category: "Verbal Reasoning",
        topic: "Direction Sense",
        subtopics: [
            { id: "r-5-1", name: "Basic Directions & Pythagoras Theorem turns", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "r-5-2", name: "Shadow-based directions & Angle turns", difficulty: "Moderate", weightage: "Medium", effort: "Low" }
        ]
    },
    {
        id: "r-6",
        subject: "General Intelligence & Reasoning",
        category: "Verbal Reasoning",
        topic: "Order & Ranking",
        subtopics: [
            { id: "r-6-1", name: "Row position calculations & Interchanging positions", difficulty: "Easy", weightage: "Low", effort: "Low" },
            { id: "r-6-2", name: "Comparison puzzles (A is taller than B...)", difficulty: "Easy", weightage: "Medium", effort: "Low" }
        ]
    },
    {
        id: "r-7",
        subject: "General Intelligence & Reasoning",
        category: "Verbal Reasoning",
        topic: "Syllogism",
        subtopics: [
            { id: "r-7-1", name: "Basic Venn Diagram (Some/All/No cases)", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "r-7-2", name: "Possibility cases & Either-Or conditions", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "r-7-3", name: "Only / Few / Only a few advanced Syllogisms", difficulty: "Hard", weightage: "Medium", effort: "Moderate" }
        ]
    },
    {
        id: "r-8",
        subject: "General Intelligence & Reasoning",
        category: "Verbal Reasoning",
        topic: "Seating Arrangement & Puzzles",
        subtopics: [
            { id: "r-8-1", name: "Linear & Circular seating (Facing inside/outside)", difficulty: "Moderate", weightage: "Low", effort: "Moderate" },
            { id: "r-8-2", name: "Matrix/Grid based puzzle puzzles", difficulty: "Hard", weightage: "Low", effort: "Moderate" }
        ]
    },
    {
        id: "r-9",
        subject: "General Intelligence & Reasoning",
        category: "Verbal Reasoning",
        topic: "Data Sufficiency",
        subtopics: [
            { id: "r-9-1", name: "Data sufficiency using Reasoning principles", difficulty: "Hard", weightage: "Low", effort: "Moderate" }
        ]
    },
    {
        id: "r-10",
        subject: "General Intelligence & Reasoning",
        category: "Non-Verbal Reasoning",
        topic: "Paper Folding & Cutting",
        subtopics: [
            { id: "r-10-1", name: "Visualizing unfolded paper patterns", difficulty: "Easy", weightage: "Low", effort: "Low" }
        ]
    },
    {
        id: "r-11",
        subject: "General Intelligence & Reasoning",
        category: "Non-Verbal Reasoning",
        topic: "Mirror & Water Images",
        subtopics: [
            { id: "r-11-1", name: "Alphabet & Figure reflective images", difficulty: "Easy", weightage: "Low", effort: "Low" }
        ]
    },
    {
        id: "r-12",
        subject: "General Intelligence & Reasoning",
        category: "Non-Verbal Reasoning",
        topic: "Embedded Figures & Completion",
        subtopics: [
            { id: "r-12-1", name: "Finding embedded figures & completing designs", difficulty: "Easy", weightage: "High", effort: "Low" }
        ]
    },
    {
        id: "r-13",
        subject: "General Intelligence & Reasoning",
        category: "Non-Verbal Reasoning",
        topic: "Figure Series & Matrix",
        subtopics: [
            { id: "r-13-1", name: "Rotational series & element shifts patterns", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "r-13-2", name: "Dice (Standard, Open Dice opposites properties)", difficulty: "Easy", weightage: "High", effort: "Low" }
        ]
    },

    // 3. ENGLISH LANGUAGE & COMPREHENSION
    {
        id: "e-1",
        subject: "English Language & Comprehension",
        category: "Grammar",
        topic: "Parts of Speech",
        subtopics: [
            { id: "e-1-1", name: "Nouns & Pronouns Rules", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "e-1-2", name: "Subject-Verb Agreement (Concord)", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "e-1-3", name: "Adjectives & Adverbs positioning rules", difficulty: "Moderate", weightage: "Medium", effort: "Low" },
            { id: "e-1-4", name: "Prepositions usage & Fixed Prepositions (Tough)", difficulty: "Hard", weightage: "High", effort: "Moderate" },
            { id: "e-1-5", name: "Conjunctions & Conditional Sentences", difficulty: "Moderate", weightage: "Medium", effort: "Low" }
        ]
    },
    {
        id: "e-2",
        subject: "English Language & Comprehension",
        category: "Grammar",
        topic: "Active & Passive Voice",
        subtopics: [
            { id: "e-2-1", name: "Tense changes & Auxiliary verbs transitions", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "e-2-2", name: "Imperative, Interrogative & Infinitive Voice shifts", difficulty: "Moderate", weightage: "High", effort: "Low" }
        ]
    },
    {
        id: "e-3",
        subject: "English Language & Comprehension",
        category: "Grammar",
        topic: "Direct & Indirect Speech",
        subtopics: [
            { id: "e-3-1", name: "Assertive sentences, Tense & Time conversion rules", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "e-3-2", name: "Exclamatory, Optative & Coded sentence conversions", difficulty: "Moderate", weightage: "High", effort: "Low" }
        ]
    },
    {
        id: "e-4",
        subject: "English Language & Comprehension",
        category: "Grammar",
        topic: "Error Spotting & Improvement",
        subtopics: [
            { id: "e-4-1", name: "Noun/Pronoun/Verb Spotting drills", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "e-4-2", name: "Modifier, Dangling Participle, Parallelism errors", difficulty: "Hard", weightage: "High", effort: "Moderate" }
        ]
    },
    {
        id: "e-5",
        subject: "English Language & Comprehension",
        category: "Vocabulary",
        topic: "Vocabulary Drills",
        subtopics: [
            { id: "e-5-1", name: "Synonyms & Antonyms (High frequency wordlists)", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "e-5-2", name: "Idioms & Phrases (Origins & applications)", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "e-5-3", name: "One-word Substitutions lists", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "e-5-4", name: "Spelling Correction & Homophones tricks", difficulty: "Easy", weightage: "Low", effort: "Low" }
        ]
    },
    {
        id: "e-6",
        subject: "English Language & Comprehension",
        category: "Reading Comprehension",
        topic: "Reading Comprehension Passages",
        subtopics: [
            { id: "e-6-1", name: "Direct Fact retrieval & Vocabulary contextual clues", difficulty: "Easy", weightage: "High", effort: "Moderate" },
            { id: "e-6-2", name: "Inference-based, Tone & Central Theme questions", difficulty: "Hard", weightage: "High", effort: "High" }
        ]
    },
    {
        id: "e-7",
        subject: "English Language & Comprehension",
        category: "Reading Comprehension",
        topic: "Cloze Test",
        subtopics: [
            { id: "e-7-1", name: "Grammar-based blanks matching", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "e-7-2", name: "Contextual vocabulary & Collocations fit", difficulty: "Hard", weightage: "High", effort: "High" }
        ]
    },
    {
        id: "e-8",
        subject: "English Language & Comprehension",
        category: "Reading Comprehension",
        topic: "Para-jumbles",
        subtopics: [
            { id: "e-8-1", name: "Finding opening/concluding sentences", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "e-8-2", name: "Mandatory Pairs & Pronoun link methods", difficulty: "Hard", weightage: "High", effort: "High" }
        ]
    },

    // 4. GENERAL AWARENESS
    {
        id: "a-1",
        subject: "General Awareness",
        category: "Static GK",
        topic: "History",
        subtopics: [
            { id: "a-1-1", name: "Ancient History (Harappan, Vedic, Buddhism & Mauryas)", difficulty: "Moderate", weightage: "High", effort: "High" },
            { id: "a-1-2", name: "Medieval History (Delhi Sultanate, Mughals, Vijayanagara)", difficulty: "Moderate", weightage: "High", effort: "High" },
            { id: "a-1-3", name: "Modern History (Marathas, British expansion, Congress, Gandhi Era)", difficulty: "Hard", weightage: "High", effort: "High" }
        ]
    },
    {
        id: "a-2",
        subject: "General Awareness",
        category: "Static GK",
        topic: "Geography",
        subtopics: [
            { id: "a-2-1", name: "Indian Physical Geography (Borders, Himalayas, Rivers & Dams)", difficulty: "Easy", weightage: "Medium", effort: "High" },
            { id: "a-2-2", name: "World Physical Geography (Solar system, Oceans, Atmosphere, Deserts)", difficulty: "Easy", weightage: "Medium", effort: "High" },
            { id: "a-2-3", name: "Economic & Human Geography (Crops, Minerals, Census 2011)", difficulty: "Moderate", weightage: "High", effort: "Moderate" }
        ]
    },
    {
        id: "a-3",
        subject: "General Awareness",
        category: "Static GK",
        topic: "Indian Polity & Constitution",
        subtopics: [
            { id: "a-3-1", name: "Making of Constitution, Sources, Schedules & Parts", difficulty: "Easy", weightage: "High", effort: "Moderate" },
            { id: "a-3-2", name: "Fundamental Rights, Duties & DPSP (Art 12-51A)", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "a-3-3", name: "President, Parliament, State Legislature & Local Govts", difficulty: "Moderate", weightage: "High", effort: "High" },
            { id: "a-3-4", name: "Judiciary & Constitutional Bodies (CAG, Election Comm, UPSC)", difficulty: "Hard", weightage: "Medium", effort: "Moderate" }
        ]
    },
    {
        id: "a-4",
        subject: "General Awareness",
        category: "Static GK",
        topic: "Economics",
        subtopics: [
            { id: "a-4-1", name: "Introduction to Economics, Demand-Supply, Elasticity", difficulty: "Moderate", weightage: "Low", effort: "Moderate" },
            { id: "a-4-2", name: "Macroeconomics (Inflation, GDP/National Income, Five Year Plans)", difficulty: "Moderate", weightage: "Medium", effort: "Moderate" },
            { id: "a-4-3", name: "Banking & Financial Sector (RBI, Repo Rate, Mon Policy, Budget)", difficulty: "Hard", weightage: "Medium", effort: "Moderate" }
        ]
    },
    {
        id: "a-5",
        subject: "General Awareness",
        category: "Static GK",
        topic: "Art & Culture",
        subtopics: [
            { id: "a-5-1", name: "Indian Classical Dances, Folk Dances & Famous Artists", difficulty: "Easy", weightage: "Medium", effort: "Moderate" },
            { id: "a-5-2", name: "Festivals, Fair, Fairs & Folk Music", difficulty: "Easy", weightage: "Medium", effort: "Moderate" },
            { id: "a-5-3", name: "UNESCO World Heritage sites, Temples & Architecture styles", difficulty: "Moderate", weightage: "High", effort: "Moderate" }
        ]
    },
    {
        id: "a-6",
        subject: "General Awareness",
        category: "Science",
        topic: "Physics",
        subtopics: [
            { id: "a-6-1", name: "Units, Dimensions & Motion mechanics", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "a-6-2", name: "Work, Energy, Power & Gravity rules", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "a-6-3", name: "Optics (Refraction, Lenses), Wave motion, Sound & Electricity", difficulty: "Moderate", weightage: "High", effort: "Moderate" }
        ]
    },
    {
        id: "a-7",
        subject: "General Awareness",
        category: "Science",
        topic: "Chemistry",
        subtopics: [
            { id: "a-7-1", name: "Matter, States, Atomic Structure & Chemical Bonds", difficulty: "Easy", weightage: "Medium", effort: "Low" },
            { id: "a-7-2", name: "Acids, Bases & Salts, Common Chemicals formulas", difficulty: "Easy", weightage: "High", effort: "Low" },
            { id: "a-7-3", name: "Metals & Non-metals, Periodic Table properties", difficulty: "Moderate", weightage: "Medium", effort: "Moderate" }
        ]
    },
    {
        id: "a-8",
        subject: "General Awareness",
        category: "Science",
        topic: "Biology",
        subtopics: [
            { id: "a-8-1", name: "Cell Structure & Divisions, Plant/Animal Kingdom", difficulty: "Moderate", weightage: "High", effort: "Moderate" },
            { id: "a-8-2", name: "Human Anatomy (Circulatory, Nervous, Digestive systems)", difficulty: "Moderate", weightage: "High", effort: "High" },
            { id: "a-8-3", name: "Vitamins, Nutrients & Human Diseases (Bacteria/Viruses)", difficulty: "Easy", weightage: "High", effort: "Low" }
        ]
    },
    {
        id: "a-9",
        subject: "General Awareness",
        category: "Current Affairs",
        topic: "Current Affairs",
        subtopics: [
            { id: "a-9-1", name: "National & International News (Past 6-9 Months)", difficulty: "Hard", weightage: "High", effort: "High" },
            { id: "a-9-2", name: "Sports, Awards, Honors & Nobel Prize winners", difficulty: "Hard", weightage: "High", effort: "Moderate" },
            { id: "a-9-3", name: "Central Govt Schemes, Indexes, Military Exercises", difficulty: "Hard", weightage: "High", effort: "Moderate" }
        ]
    }
];

// 2. 40-DAY STUDY ROADMAP MAPPING
// Targets strictly focus on the four core subjects. Computer prep is delegated to daily drills in the background.
const PLAN_DATA = [
    // PHASE 1: Foundations & Easy Topics (Days 1-10)
    { day: 1, dayType: "study", phase: 1, name: "Shortcuts & Verbals Foundation", desc: "Set up speed tables, Noun rules, basic physics equations, and Coding-Decoding.", targets: ["q-10-6", "r-1-1", "e-1-1", "a-2-1"], test: "Vocabulary Drill 1", time: "4.5h" },
    { day: 2, dayType: "study", phase: 1, name: "Percentage & Analogy Basics", desc: "Build base for fractions percentage conversions. Practice letter analogy rules.", targets: ["q-1-1", "r-1-2", "r-2-1", "e-1-2"], test: "Reasoning Sectional 1", time: "4.5h" },
    { day: 3, dayType: "study", phase: 1, name: "Ratio, Proportions & Word analogies", desc: "Master balancing ratio proportions and combining fractional margins.", targets: ["q-2-1", "q-2-2", "r-2-2", "e-5-1"], test: "Quant Mini Sectional 1", time: "5.0h" },
    { day: 4, dayType: "study", phase: 1, name: "Average & Speed Directions", desc: "Learn consecutive numbers averages and Pythagoras direction maps.", targets: ["q-3-1", "r-5-1", "e-5-2", "a-6-1"], test: "Vocabulary Drill 2", time: "5.0h" },
    { day: 5, dayType: "study", phase: 1, name: "Advanced Percentage & Pronouns", desc: "Successive change formulas in percentage. Direction shadow rules.", targets: ["q-1-2", "r-5-2", "e-1-3", "a-7-1"], test: "None", time: "5.0h" },
    { day: 6, dayType: "study", phase: 1, name: "Ratio Advanced & Series patterns", desc: "Income-expense ratio splits. Alphanumeric series logic. Static art and culture.", targets: ["q-2-3", "r-3-1", "e-5-3", "a-5-1"], test: "English Vocab Quiz 1", time: "4.5h" },
    { day: 7, dayType: "study", phase: 1, name: "Average Group Adjustments & Medieval GK", desc: "Replacement properties of groups. Chronology of Delhi Sultanate.", targets: ["q-3-2", "r-6-1", "e-5-4", "a-1-2"], test: "English Grammar Quiz", time: "5.0h" },
    { day: 8, dayType: "study", phase: 1, name: "Simplification & Constitution structure", desc: "BODMAS simplifications. Parts, schedules and sources of Indian constitution.", targets: ["q-10-1", "r-6-2", "e-1-5", "a-3-1"], test: "Reasoning Speed Test 1", time: "4.5h" },
    { day: 9, dayType: "study", phase: 1, name: "Arithmetic Foundations Review", desc: "Resolve incorrect equations in ratios/percent. Review monthly current affairs.", targets: ["q-1-3", "r-4-1", "e-1-4", "a-9-1"], test: "GK Static Revision Test", time: "5.5h" },
    { day: 10, dayType: "test", phase: 1, name: "Phase 1 Revision & Full Mock Test 1", desc: "Simulate exact exam environment. Spend 3 hours reviewing mock mistakes.", targets: [], test: "Full Length Mock 01 & Analysis", time: "6.0h" },

    // PHASE 2: Applications & Practice (Days 11-25)
    { day: 11, dayType: "study", phase: 2, name: "Profit & Loss & Paper Folding", desc: "Cost price and selling price ratios. Visual folded cuts. Sentence improvements.", targets: ["q-4-1", "r-10-1", "e-4-1", "a-3-2"], test: "English Grammar Test 2", time: "5.0h" },
    { day: 12, dayType: "study", phase: 2, name: "Simple Interest & Mirror Images", desc: "Rate and time adjustments. Reflective images in alphabets. Parliament rules.", targets: ["q-5-1", "r-11-1", "e-4-2", "a-3-3"], test: "Reasoning Non-Verbal Test", time: "5.0h" },
    { day: 13, dayType: "study", phase: 2, name: "Compound Interest & Figure Completion", desc: "CI compounding calculations. Figure completion. Active/Passive voice shifts.", targets: ["q-5-2", "r-12-1", "e-2-1", "a-8-3"], test: "Quant CI Sectional", time: "5.5h" },
    { day: 14, dayType: "study", phase: 2, name: "Time & Work (LCM) & Dice Rules", desc: "Efficiency and total units via LCM. Dice standard vs open positions.", targets: ["q-6-1", "r-13-2", "e-2-2", "a-8-1"], test: "Reasoning Sectional 2", time: "5.0h" },
    { day: 15, dayType: "study", phase: 2, name: "TSD & Direct/Indirect Speech", desc: "Relative speed and train crossovers. Direct indirect speech converters.", targets: ["q-7-1", "r-13-1", "e-3-1", "a-6-2"], test: "English Voice & Narration Drill", time: "5.5h" },
    { day: 16, dayType: "study", phase: 2, name: "Profit & Loss (Discounts)", desc: "Marked price, discounts and successive margins. Indian physical geography.", targets: ["q-4-2", "r-4-2", "e-3-2", "a-2-2"], test: "GK Geography Test", time: "5.0h" },
    { day: 17, dayType: "study", phase: 2, name: "SI-CI Differences & Syllogism Intro", desc: "2 & 3 year CI-SI differences formulas. Syllogism basics (Some/All Venn).", targets: ["q-5-3", "r-7-1", "e-4-2", "a-2-3"], test: "Reasoning Syllogism Quiz", time: "5.5h" },
    { day: 18, dayType: "study", phase: 2, name: "Alternate Days Work & Syllogism Cases", desc: "Pipes & cisterns logic. Syllogism possibilities. Cell biology structure.", targets: ["q-6-2", "q-6-4", "r-7-2", "a-8-2"], test: "Time-Work Sectional Drill", time: "5.5h" },
    { day: 19, dayType: "study", phase: 2, name: "Boats & Streams & Modern History Revolt", desc: "Upstream and downstream speeds. Modern history 1857 revolt details.", targets: ["q-7-3", "r-7-3", "e-4-2", "a-1-3"], test: "None", time: "5.0h" },
    { day: 20, dayType: "test", phase: 2, name: "Mid-Term Review & Full Mock Test 2", desc: "Evaluate progress in Arithmetic. Spend extra time analyzing mock errors.", targets: [], test: "Full Length Mock 02 & Analysis", time: "6.0h" },
    { day: 21, dayType: "study", phase: 2, name: "Partnership & Economics Demand", desc: "Capital time ratio calculations. Demand, supply and elasticity core terms.", targets: ["q-9-1", "q-9-2", "e-1-4", "a-4-1"], test: "GK Economics Drill", time: "5.0h" },
    { day: 22, dayType: "study", phase: 2, name: "P&L Dishonest Dealer & Judiciary GK", desc: "Cheating weight margins. Supreme Court and CAG articles. Physics optics.", targets: ["q-4-3", "r-7-2", "a-3-4", "a-6-3"], test: "Quant P&L Special Test", time: "5.5h" },
    { day: 23, dayType: "study", phase: 2, name: "Work & Wages & Chemistry Formulas", desc: "Wage divisions based on work. Acids bases and salts.", targets: ["q-6-3", "q-6-5", "r-7-3", "a-7-2"], test: "Science Chemistry Quiz", time: "5.0h" },
    { day: 24, dayType: "study", phase: 2, name: "Mixture & Alligation Dilutions", desc: "Dilution formulas. Current Affairs Month 2. Word power lists.", targets: ["q-8-1", "q-8-2", "e-5-2", "a-9-2"], test: "GK Current Affairs Test 2", time: "5.0h" },
    { day: 25, dayType: "test", phase: 2, name: "Phase 2 Target Mock & Review", desc: "Take a strict timed mock. Mark formulas in mistake notebook.", targets: [], test: "Full Length Mock 03 & Analysis", time: "6.0h" },

    // PHASE 3: Advanced Math & Harder Topics (Days 26-35)
    { day: 26, dayType: "study", phase: 3, name: "Advanced Number System Remainders", desc: "Remainder theorems (Fermat/Wilson/Euler). Reading Comprehension strategies.", targets: ["q-10-2", "q-10-4", "r-8-1", "e-6-1", "a-1-1"], test: "English RC Practice (3 Passages)", time: "6.0h" },
    { day: 27, dayType: "study", phase: 3, name: "Algebra Identities & Cloze Test", desc: "Quadratic identities and graphs. Cloze test grammar matching.", targets: ["q-11-1", "q-11-2", "r-8-2", "e-7-1", "a-4-2"], test: "Quant Algebra Drill", time: "6.0h" },
    { day: 28, dayType: "study", phase: 3, name: "Geometry Similarity & Para-jumbles", desc: "Triangle centers and similarity. Para jumbles opening sentence links.", targets: ["q-12-2", "q-12-3", "r-9-1", "e-8-1", "a-4-3"], test: "Reasoning Puzzle Test", time: "6.5h" },
    { day: 29, dayType: "study", phase: 3, name: "Geometry Circles & Advanced RC", desc: "Circle tangents, secants properties. Inference based RC questions.", targets: ["q-12-4", "q-12-5", "r-3-2", "e-6-2", "a-5-2"], test: "English Passage speed drill", time: "6.0h" },
    { day: 30, dayType: "study", phase: 3, name: "Mensuration 2D/3D Formulas", desc: "Surface areas and volumes formulas. Cloze vocabulary matching.", targets: ["q-13-1", "q-13-2", "q-13-3", "e-7-2"], test: "Quant Mensuration Special", time: "6.5h" },
    { day: 31, dayType: "study", phase: 3, name: "Trigonometry Values & Para-jumbles Pairs", desc: "Trig complementary ratios. Para jumbles pronoun connectors.", targets: ["q-14-1", "q-14-2", "r-3-3", "e-8-2", "a-5-3"], test: "English Jumbles speed run", time: "6.0h" },
    { day: 32, dayType: "study", phase: 3, name: "Mensuration Prisms & Chemistry Table", desc: "Pyramids and frustum volumes. Periodic table chemical bonds.", targets: ["q-13-4", "q-13-5", "r-8-1", "a-7-3"], test: "Quant Mensuration Advanced", time: "6.5h" },
    { day: 33, dayType: "study", phase: 3, name: "Trig Max-Min & Current Affairs 3", desc: "Maximum minimum limits of sin/cos. Government schemes and honors.", targets: ["q-14-3", "q-14-4", "r-8-2", "e-5-1", "a-9-3"], test: "GK Central Schemes Quiz", time: "6.0h" },
    { day: 34, dayType: "study", phase: 3, name: "Statistics, Probability & Mean Mode", desc: "Mean, median, mode calculations and dice probability. National parks static GK.", targets: ["q-15-1", "q-15-2", "q-15-3", "a-2-3"], test: "Quant Stats & Prob Quiz", time: "5.5h" },
    { day: 35, dayType: "test", phase: 3, name: "Phase 3 Revision & Full Mock Test 4", desc: "Incorporate advanced math topics in the mock. Evaluate speed factors.", targets: [], test: "Full Length Mock 04 & Analysis", time: "6.5h" },

    // PHASE 4: Simulations & Intense Revision (Days 36-40)
    { day: 36, dayType: "simulation", phase: 4, name: "Simulation Run & Mock Test 5", desc: "Simulate exact exam timing. Revise mistake notebook for 2 hours.", targets: ["q-16-1", "q-16-2", "q-16-3"], test: "Full Length Mock 05 & Analysis", time: "6.5h" },
    { day: 37, dayType: "simulation", phase: 4, name: "Simulation Run & Mock Test 6", desc: "Complete mock and full qualifying computer section. Memorize GK summaries.", targets: [], test: "Full Length Mock 06 & Computer Test", time: "6.5h" },
    { day: 38, dayType: "simulation", phase: 4, name: "Simulation Run & Mock Test 7", desc: "Final full length simulation. Mark remaining errors in mistake log.", targets: [], test: "Full Length Mock 07 & Analysis", time: "6.5h" },
    { day: 39, dayType: "simulation", phase: 4, name: "Final Review & Rapid Drill", desc: "Review all formulas in Geometry/Mensuration. Practice 100 synonym flashcards.", targets: [], test: "Quant Formula Rapid Test", time: "5.0h" },
    { day: 40, dayType: "exam", phase: 4, name: "Mindset Prep & Strategy Lock", desc: "Relax. Review your formulas. Sleep for 8 hours. You are ready to conquer!", targets: [], test: "Final Strategy Lock", time: "2.0h" }
];

// 3. APPLICATION STATE MANAGEMENT
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

// Header Scroll Shrink (Floating Island Dock UI)
function initHeaderScroll() {
    let lastScrollY = window.scrollY;
    const header = document.querySelector("header");
    
    if (!header) return;
    
    window.addEventListener("scroll", () => {
        // Stop scroll-shrinking on mobile layout to avoid header jumpiness and navigation glitches
        if (window.innerWidth < 768) {
            header.classList.remove("header-shrink");
            return;
        }

        const currentScrollY = window.scrollY;
        
        // Scroll down past 80px: shrink header
        if (currentScrollY > 80 && currentScrollY > lastScrollY) {
            header.classList.add("header-shrink");
        }
        // Scroll up (even a little): expand header
        else if (currentScrollY < lastScrollY) {
            header.classList.remove("header-shrink");
        }
        
        lastScrollY = currentScrollY;
    });
}

function initExamTargetEditor() {
    const btnToggle = document.getElementById("btn-toggle-exam-edit");
    const viewPanel = document.getElementById("exam-target-view");
    const editPanel = document.getElementById("exam-target-edit");
    const inputName = document.getElementById("input-exam-name");
    const inputDate = document.getElementById("input-exam-date");
    const btnSave = document.getElementById("btn-save-exam-target");
    const btnCancel = document.getElementById("btn-cancel-exam-target");

    function updateDisplay() {
        const displayName = document.getElementById("display-exam-name");
        const displayDate = document.getElementById("display-exam-date");
        const headerLabel = document.getElementById("countdown-label");

        if (displayName) displayName.innerText = appState.examName;
        if (displayDate) {
            const dateObj = new Date(appState.examDate);
            if (!isNaN(dateObj)) {
                displayDate.innerText = dateObj.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
            } else {
                displayDate.innerText = appState.examDate;
            }
        }
        if (headerLabel) headerLabel.innerText = `${appState.examName}:`;
    }

    if (btnToggle) {
        btnToggle.onclick = () => {
            const isEditing = !editPanel.classList.contains("hidden");
            if (isEditing) {
                editPanel.classList.add("hidden");
                viewPanel.classList.remove("hidden");
                btnToggle.innerText = "Edit";
            } else {
                inputName.value = appState.examName;
                inputDate.value = appState.examDate.split("T")[0];
                editPanel.classList.remove("hidden");
                viewPanel.classList.add("hidden");
                btnToggle.innerText = "Close";
            }
        };
    }

    if (btnCancel) {
        btnCancel.onclick = () => {
            editPanel.classList.add("hidden");
            viewPanel.classList.remove("hidden");
            if (btnToggle) btnToggle.innerText = "Edit";
        };
    }

    if (btnSave) {
        btnSave.onclick = () => {
            const nameVal = inputName.value.trim();
            const dateVal = inputDate.value;

            if (!nameVal || !dateVal) {
                alert("Please enter both target exam name and date.");
                return;
            }

            appState.examName = nameVal;
            appState.examDate = dateVal;
            saveStateToStorage();
            updateDisplay();

            editPanel.classList.add("hidden");
            viewPanel.classList.remove("hidden");
            if (btnToggle) btnToggle.innerText = "Edit";
        };
    }

    updateDisplay();
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    loadStateFromStorage();
    initTheme();
    initNavigation();
    initHeaderScroll();
    initExamTargetEditor();
    initSessionTimer();
    initPomoTimer();
    initSearchAndFilters();
    initForms();
    initModals();
    initToolkitTabs();
    
    // Initial Render
    renderAll();
    startExamCountdown();
    initSpeedDrillsPage();
    
    // Compile LaTeX equations once CDNs are parsed
    setTimeout(triggerMathTypesetting, 300);
});

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

// 4. NAVIGATION & THEME LOGIC
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item, .mobile-nav-item");
    const pages = document.querySelectorAll(".content-page");
    const mobileMenu = document.getElementById("mobile-menu");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");

    // Desktop/Mobile Navigation Toggling
    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const target = item.getAttribute("data-target");
            
            navItems.forEach(ni => ni.classList.remove("active-nav"));
            pages.forEach(p => p.classList.add("hidden"));
            
            // Highlight both desktop and mobile items matching target
            document.querySelectorAll(`[data-target="${target}"]`).forEach(ni => ni.classList.add("active-nav"));
            
            const targetPage = document.getElementById(target);
            if (targetPage) {
                targetPage.classList.remove("hidden");
            }
            
            // Dynamically update the header page title
            const headerPageTitle = document.getElementById("header-page-title");
            if (headerPageTitle) {
                let friendlyName = "Dashboard";
                if (target === "page-syllabus") friendlyName = "Syllabus Tracker";
                else if (target === "page-plan") friendlyName = "40-Day Plan";
                else if (target === "page-mocks") friendlyName = "Mock Analytics";
                else if (target === "page-toolkit") friendlyName = "Study Toolkit";
                else if (target === "page-speed") friendlyName = "Speed Drills";
                headerPageTitle.innerText = friendlyName;
            }
            
            // Close mobile menu dropdown
            mobileMenu.classList.add("hidden");
            
            // Trigger specific page renders
            if (target === "page-syllabus") {
                renderSyllabus();
            } else if (target === "page-plan") {
                renderStudyPlan();
            } else if (target === "page-mocks") {
                renderMockAnalytics();
            } else if (target === "page-toolkit") {
                renderToolkit();
            } else if (target === "page-speed") {
                resetDrillSession();
                setTimeout(triggerMathTypesetting, 50);
            }
        });
    });

    // Mobile Hamburger Menu Toggle
    mobileMenuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
}

function initTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    
    // Apply theme classes
    if (appState.theme === "light") {
        document.body.classList.add("light-theme");
        document.documentElement.classList.remove("dark");
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
        document.body.classList.remove("light-theme");
        document.documentElement.classList.add("dark");
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
    
    themeBtn.addEventListener("click", () => {
        appState.theme = appState.theme === "dark" ? "light" : "dark";
        if (appState.theme === "light") {
            document.body.classList.add("light-theme");
            document.documentElement.classList.remove("dark");
            themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        } else {
            document.body.classList.remove("light-theme");
            document.documentElement.classList.add("dark");
            themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        }
        saveStateToStorage();
        
        // Re-render SVG Mindmap if visible to adjust colors
        if (!document.getElementById("view-mindmap").classList.contains("hidden")) {
            renderMindMap();
        }
    });
}

// 5. TOOLKIT SUB-TABS INTERACTIVITY
function initToolkitTabs() {
    const tkTabs = document.querySelectorAll(".toolkit-tab-btn");
    const tkPanels = document.querySelectorAll(".toolkit-panel");

    tkTabs.forEach(tab => {
        tab.onclick = () => {
            tkTabs.forEach(t => t.classList.remove("active-nav-tab"));
            tab.classList.add("active-nav-tab");

            const targetPanelId = tab.getAttribute("data-target");
            tkPanels.forEach(p => p.classList.add("hidden"));
            
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.remove("hidden");
            }
        };
    });

    // Custom Note Book Sub-categories Filtering
    const noteFilterBtns = document.querySelectorAll(".note-filter-btn");
    noteFilterBtns.forEach(btn => {
        btn.onclick = () => {
            noteFilterBtns.forEach(b => b.classList.remove("active-nav-tab"));
            btn.classList.add("active-nav-tab");
            renderToolkit();
        };
    });
}

// 6. GENERAL PROGRESS COMPUTATIONS & RENDER
function renderAll() {
    renderDashboardOverview();
    renderSubjectProgressBars();
    setTimeout(triggerMathTypesetting, 50);
}

function calculateOverallStats() {
    let totalSubtopics = 0;
    let learnedCount = 0;
    let practicedCount = 0;
    let masteredCount = 0;
    
    Object.keys(appState.syllabusProgress).forEach(id => {
        totalSubtopics++;
        const prog = appState.syllabusProgress[id];
        if (prog.learned) learnedCount++;
        if (prog.practiced) practicedCount++;
        if (prog.mastered) masteredCount++;
    });

    let totalPrepPoints = 0;
    Object.keys(appState.syllabusProgress).forEach(id => {
        const prog = appState.syllabusProgress[id];
        if (prog.mastered) {
            totalPrepPoints += 1.0;
        } else if (prog.practiced) {
            totalPrepPoints += 0.6;
        } else if (prog.learned) {
            totalPrepPoints += 0.3;
        }
    });

    const prepScorePercent = totalSubtopics > 0 ? Math.round((totalPrepPoints / totalSubtopics) * 100) : 0;
    
    // Subject wise progress
    const subjectProgress = {};
    const subjectTotals = {};
    
    SYLLABUS_DATA.forEach(topic => {
        const subName = topic.subject;
        if (!subjectProgress[subName]) {
            subjectProgress[subName] = 0;
            subjectTotals[subName] = 0;
        }
        
        topic.subtopics.forEach(sub => {
            subjectTotals[subName]++;
            const prog = appState.syllabusProgress[sub.id];
            if (prog) {
                if (prog.mastered) subjectProgress[subName] += 1.0;
                else if (prog.practiced) subjectProgress[subName] += 0.6;
                else if (prog.learned) subjectProgress[subName] += 0.3;
            }
        });
    });

    const subjectScores = {};
    Object.keys(subjectTotals).forEach(sub => {
        subjectScores[sub] = Math.round((subjectProgress[sub] / subjectTotals[sub]) * 100);
    });

    return {
        prepScore: prepScorePercent,
        learned: learnedCount,
        practiced: practicedCount,
        mastered: masteredCount,
        total: totalSubtopics,
        subjectScores: subjectScores
    };
}

function renderDashboardOverview() {
    const stats = calculateOverallStats();
    
    // Prep Score card
    document.getElementById("prep-score").innerText = stats.prepScore + "%";
    document.getElementById("prep-score-fill").style.width = stats.prepScore + "%";
    
    // Day progress card
    document.getElementById("day-progress").innerText = `Day ${appState.currentDay} of 40`;
    const progressPercent = ((appState.currentDay) / 40) * 100;
    document.getElementById("day-progress-fill").style.width = Math.min(progressPercent, 100) + "%";
    
    // Mocks card
    const loggedMocks = appState.mocks.length;
    document.getElementById("mocks-taken-count").innerText = loggedMocks;
    const mockPercent = (loggedMocks / 30) * 100; // Target: 30 Mocks
    document.getElementById("mocks-fill").style.width = Math.min(mockPercent, 100) + "%";
    
    // Mission Day Num
    document.getElementById("mission-day-num").innerText = appState.currentDay;

    // Daily Goals card - Calculated via Today's target checkmarks
    updateTodayGoalsRatio();

    // Load Today's tasks (Missions)
    renderTodayMissions();
    
    // Load daily rituals checkbox states
    loadRituals();
}

function updateTodayGoalsRatio() {
    const dayData = PLAN_DATA.find(d => d.day === appState.currentDay);
    if (!dayData) return;

    let targetCount = dayData.targets.length;
    let completedCount = 0;

    dayData.targets.forEach(targetId => {
        const prog = appState.syllabusProgress[targetId];
        // Goal is complete if either Practiced or Mastered is checked
        if (prog && (prog.practiced || prog.mastered)) {
            completedCount++;
        }
    });

    // Add extra ritual goals (total 4 checks)
    const ritualsCompleted = Object.values(appState.dailyRituals).filter(Boolean).length;
    const totalGoals = targetCount + 4;
    const completedGoals = completedCount + ritualsCompleted;

    document.getElementById("daily-goals-ratio").innerText = `${completedGoals}/${totalGoals} Done`;
    const goalPercent = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;
    document.getElementById("daily-goals-fill").style.width = goalPercent + "%";
}

function renderTodayMissions() {
    const container = document.getElementById("today-tasks-container");
    const dayData = PLAN_DATA.find(d => d.day === appState.currentDay);
    
    if (!dayData) {
        container.innerHTML = `<div class="text-center text-xs text-gray-500 py-4">No study targets scheduled for today. Complete the preparation!</div>`;
        return;
    }

    // Set phase badge
    const badgeEl = document.getElementById("mission-phase-badge");
    if (dayData.phase === 1) {
        badgeEl.innerText = "Phase 1: Foundations";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentPurple/20 border border-accentPurple/30 text-purple-300 uppercase";
    } else if (dayData.phase === 2) {
        badgeEl.innerText = "Phase 2: Application";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentAmber/20 border border-accentAmber/30 text-amber-300 uppercase";
    } else if (dayData.phase === 3) {
        badgeEl.innerText = "Phase 3: Advanced Math";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentCyan/20 border border-accentCyan/30 text-cyan-300 uppercase";
    } else {
        badgeEl.innerText = "Phase 4: Revision";
        badgeEl.className = "px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accentRose/20 border border-accentRose/30 text-rose-300 uppercase";
    }

    if (dayData.targets.length === 0) {
        // Revision / Mock Day
        container.innerHTML = `
            <div class="bg-bgCard border-l-4 border-accentRose border-t border-r border-b border-white/5 rounded-xl p-4 shadow">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-[10px] font-bold uppercase text-accentRose"><i class="fa-solid fa-trophy mr-1"></i> Simulation Mock Challenge</span>
                    <span class="px-2 py-0.5 bg-accentRose/15 text-accentRose rounded text-[9px] font-bold uppercase">High Weight</span>
                </div>
                <h4 class="text-xs font-bold text-white">${dayData.name}</h4>
                <p class="text-xs text-gray-400 mt-1 leading-relaxed">${dayData.desc}</p>
                <div class="mt-3 p-2 bg-rose-950/20 border border-rose-900/30 rounded text-xs text-rose-300">
                    <strong>Assignment:</strong> ${dayData.test}
                </div>
            </div>
        `;
        return;
    }

    // Load actual topics mapped to this day
    let html = "";
    
    dayData.targets.forEach(targetId => {
        let subFound = null;
        let topicFound = null;
        
        for (const topic of SYLLABUS_DATA) {
            const sub = topic.subtopics.find(s => s.id === targetId);
            if (sub) {
                subFound = sub;
                topicFound = topic;
                break;
            }
        }

        if (subFound && topicFound) {
            const prog = appState.syllabusProgress[subFound.id] || { learned: false, practiced: false, mastered: false };
            const subClass = topicFound.subject === "Quantitative Aptitude" ? "accentCyan" :
                             topicFound.subject === "General Intelligence & Reasoning" ? "accentPurple" :
                             topicFound.subject === "English Language & Comprehension" ? "accentRose" : "accentAmber";
            
            const badgeDiffClass = subFound.difficulty === "Easy" ? "bg-accentGreen/10 border-accentGreen/20 text-accentGreen" :
                                   subFound.difficulty === "Moderate" ? "bg-accentAmber/10 border-accentAmber/20 text-accentAmber" : 
                                   "bg-accentRose/10 border-accentRose/20 text-accentRose";

            html += `
                <div class="bg-bgCard border border-white/5 rounded-xl p-4 shadow hover:border-white/10 transition duration-200" data-subtopic-id="${subFound.id}">
                    <div class="flex justify-between items-start gap-2 flex-wrap mb-2">
                        <span class="text-[10px] font-bold uppercase text-${subClass}"><i class="fa-solid fa-folder-open mr-1"></i> ${topicFound.subject} &bull; ${topicFound.topic}</span>
                        <div class="flex gap-1.5">
                            <span class="border px-2 py-0.5 rounded text-[9px] font-bold uppercase ${badgeDiffClass}">${subFound.difficulty}</span>
                            <span class="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9px] font-bold text-gray-400 uppercase">${subFound.weightage} Weight</span>
                        </div>
                    </div>
                    <h4 class="text-xs font-bold text-white mb-3">${subFound.name}</h4>
                    
                    <div class="flex gap-4 border-t border-white/5 pt-3">
                        <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white select-none">
                            <input type="checkbox" class="task-cb-learned accent-accentCyan" data-id="${subFound.id}" ${prog.learned ? 'checked' : ''}>
                            <span>Learned</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white select-none">
                            <input type="checkbox" class="task-cb-practiced accent-accentPurple" data-id="${subFound.id}" ${prog.practiced ? 'checked' : ''}>
                            <span>Practiced (PYQs)</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer text-xs text-gray-400 hover:text-white select-none">
                            <input type="checkbox" class="task-cb-mastered accent-accentGreen" data-id="${subFound.id}" ${prog.mastered ? 'checked' : ''}>
                            <span>Mastered</span>
                        </label>
                    </div>
                </div>
            `;
        }
    });

    container.innerHTML = html;

    // Attach listeners to dashboard mission checkboxes
    container.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const subId = cb.getAttribute("data-id");
            const isLearned = e.target.classList.contains("task-cb-learned");
            const isPracticed = e.target.classList.contains("task-cb-practiced");
            const isMastered = e.target.classList.contains("task-cb-mastered");

            if (!appState.syllabusProgress[subId]) {
                appState.syllabusProgress[subId] = { learned: false, practiced: false, mastered: false };
            }

            if (isLearned) appState.syllabusProgress[subId].learned = cb.checked;
            if (isPracticed) appState.syllabusProgress[subId].practiced = cb.checked;
            if (isMastered) appState.syllabusProgress[subId].mastered = cb.checked;

            saveStateToStorage();
            renderAll();
        });
    });
}

function loadRituals() {
    const rDrill = document.getElementById("ritual-drill");
    const rVocab = document.getElementById("ritual-vocab");
    const rCA = document.getElementById("ritual-ca");
    const rComp = document.getElementById("ritual-computer");

    rDrill.checked = appState.dailyRituals.drill;
    rVocab.checked = appState.dailyRituals.vocab;
    rCA.checked = appState.dailyRituals.ca;
    rComp.checked = appState.dailyRituals.computer;

    const ritualCbs = [
        { el: rDrill, key: "drill" },
        { el: rVocab, key: "vocab" },
        { el: rCA, key: "ca" },
        { el: rComp, key: "computer" }
    ];

    ritualCbs.forEach(item => {
        const newEl = item.el.cloneNode(true);
        item.el.parentNode.replaceChild(newEl, item.el);
        
        newEl.addEventListener("change", (e) => {
            appState.dailyRituals[item.key] = e.target.checked;
            saveStateToStorage();
            updateTodayGoalsRatio();
        });
    });
}

function renderSubjectProgressBars() {
    const stats = calculateOverallStats();
    const container = document.getElementById("subject-progress-dashboard-container");
    
    let html = "";
    
    Object.keys(stats.subjectScores).forEach(sub => {
        const score = stats.subjectScores[sub];
        let subBarColor = "bg-accentCyan";
        let subClass = "text-accentCyan";
        let icon = "fa-calculator";
        let label = "QUANTITATIVE APTITUDE";
        
        if (sub === "General Intelligence & Reasoning") {
            subBarColor = "bg-accentPurple";
            subClass = "text-accentPurple";
            icon = "fa-brain";
            label = "REASONING MODULE";
        } else if (sub === "English Language & Comprehension") {
            subBarColor = "bg-accentRose";
            subClass = "text-accentRose";
            icon = "fa-language";
            label = "ENGLISH GRAMMAR & COMP";
        } else if (sub === "General Awareness") {
            subBarColor = "bg-accentAmber";
            subClass = "text-accentAmber";
            icon = "fa-globe";
            label = "GENERAL GK & CURRENT";
        }

        html += `
            <div class="space-y-1">
                <div class="flex justify-between items-center text-[10px] font-bold text-gray-400">
                    <span><i class="fa-solid ${icon} mr-1 ${subClass}"></i> ${label}</span>
                    <span class="${subClass}">${score}%</span>
                </div>
                <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div class="${subBarColor} h-full rounded-full transition-all duration-300" style="width: ${score}%"></div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 40-day countdown timer (Count from July 6, 2026 midnight - target August 15, 2026)
function startExamCountdown() {
    function getTargetTime() {
        const dateStr = appState.examDate || "2026-08-15";
        const parts = dateStr.split("T")[0].split("-");
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1;
        const day = parseInt(parts[2]);
        return new Date(year, month, day).getTime();
    }
    
    function updateCountdown() {
        const targetDate = getTargetTime();
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        const labelEl = document.getElementById("countdown-label");
        if (labelEl) {
            labelEl.innerText = `${appState.examName || "Countdown"}:`;
        }

        if (distance < 0) {
            const labelStr = "TARGET REACHED!";
            const timerEl = document.getElementById("countdown-timer");
            if (timerEl) timerEl.innerText = labelStr;
            const mobTimer = document.getElementById("countdown-timer-mobile");
            if (mobTimer) mobTimer.innerText = labelStr;
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const formatStr = `${days}d : ${hours.toString().padStart(2, "0")}h : ${minutes.toString().padStart(2, "0")}m`;
        const timerEl = document.getElementById("countdown-timer");
        if (timerEl) timerEl.innerText = formatStr;
        
        const mobTimer = document.getElementById("countdown-timer-mobile");
        if (mobTimer) {
            mobTimer.innerText = `${formatStr} : ${seconds.toString().padStart(2, "0")}s`;
        }
    }
    
    updateCountdown();
    if (window.countdownInterval) clearInterval(window.countdownInterval);
    window.countdownInterval = setInterval(updateCountdown, 1000);
}

// 7. SYLLABUS VIEWS AND RENDERING
function initSearchAndFilters() {
    const search = document.getElementById("syllabus-search");
    const fSubject = document.getElementById("filter-subject");
    const fDiff = document.getElementById("filter-difficulty");
    const fWeight = document.getElementById("filter-weightage");
    const fStatus = document.getElementById("filter-status");
    const vMode = document.getElementById("view-mode-select");

    const triggerRender = () => {
        const activeView = vMode.value;
        document.querySelectorAll(".view-panel").forEach(p => p.classList.add("hidden"));
        
        const targetPanel = document.getElementById(`view-${activeView}`);
        if (targetPanel) {
            targetPanel.classList.remove("hidden");
        }

        renderSyllabus();
    };

    [search, fSubject, fDiff, fWeight, fStatus].forEach(ctrl => {
        ctrl.addEventListener("input", triggerRender);
    });

    vMode.addEventListener("change", triggerRender);
}

function getFilteredSyllabus() {
    const query = document.getElementById("syllabus-search").value.toLowerCase();
    const sub = document.getElementById("filter-subject").value;
    const diff = document.getElementById("filter-difficulty").value;
    const weight = document.getElementById("filter-weightage").value;
    const status = document.getElementById("filter-status").value;

    const filtered = [];

    SYLLABUS_DATA.forEach(topic => {
        if (sub && topic.subject !== sub) return;

        const matchingSubtopics = topic.subtopics.filter(subtopic => {
            const textMatch = topic.topic.toLowerCase().includes(query) || 
                              subtopic.name.toLowerCase().includes(query) ||
                              topic.subject.toLowerCase().includes(query);
            if (query && !textMatch) return false;

            if (diff && subtopic.difficulty !== diff) return false;
            if (weight && subtopic.weightage !== weight) return false;

            const prog = appState.syllabusProgress[subtopic.id] || { learned: false, practiced: false, mastered: false };
            if (status) {
                if (status === "not-started" && (prog.learned || prog.practiced || prog.mastered)) return false;
                if (status === "completed" && !(prog.practiced || prog.mastered)) return false;
            }

            return true;
        });

        if (matchingSubtopics.length > 0) {
            filtered.push({
                ...topic,
                subtopics: matchingSubtopics
            });
        }
    });

    return filtered;
}

function renderSyllabus() {
    const viewMode = document.getElementById("view-mode-select").value;
    const data = getFilteredSyllabus();

    if (viewMode === "tree") {
        renderTreeHierarchy(data);
    } else if (viewMode === "table") {
        renderTableLayout(data);
    } else if (viewMode === "cards") {
        renderCardsLayout(data);
    } else if (viewMode === "mindmap") {
        renderMindMap(data);
    }
    
    // Trigger LaTeX typesetting
    setTimeout(triggerMathTypesetting, 50);
}

// Render Collapsible Tree Accordion
function renderTreeHierarchy(filteredData) {
    const container = document.getElementById("view-tree");
    if (filteredData.length === 0) {
        container.innerHTML = `<div class="bg-bgCard border border-white/5 rounded-xl p-5 text-center text-xs text-gray-500 shadow-md">No topics matched your search parameters.</div>`;
        return;
    }

    const subjects = {};
    filteredData.forEach(item => {
        if (!subjects[item.subject]) {
            subjects[item.subject] = [];
        }
        subjects[item.subject].push(item);
    });

    let html = "";

    Object.keys(subjects).forEach(subName => {
        const topics = subjects[subName];
        
        let subTotal = 0;
        let subDone = 0;
        topics.forEach(t => {
            t.subtopics.forEach(s => {
                subTotal++;
                const prog = appState.syllabusProgress[s.id];
                if (prog && (prog.practiced || prog.mastered)) subDone++;
            });
        });
        const subPct = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;

        let subClass = "accentCyan";
        let subBgBar = "bg-accentCyan";
        let icon = "fa-calculator";
        
        if (subName === "General Intelligence & Reasoning") { subClass = "accentPurple"; subBgBar = "bg-accentPurple"; icon = "fa-brain"; }
        else if (subName === "English Language & Comprehension") { subClass = "accentRose"; subBgBar = "bg-accentRose"; icon = "fa-language"; }
        else if (subName === "General Awareness") { subClass = "accentAmber"; subBgBar = "bg-accentAmber"; icon = "fa-globe"; }

        html += `
            <div class="bg-bgCard border border-white/5 rounded-xl shadow-md overflow-hidden transition-all" id="tree-subject-${subName.replace(/\s+/g, '-')}">
                <div class="tree-subject-header flex items-center justify-between p-4 cursor-pointer hover:bg-white/2px select-none">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-${subClass}/10 text-${subClass} flex items-center justify-center text-sm">
                            <i class="fa-solid ${icon}"></i>
                        </div>
                        <h3 class="text-xs font-bold text-white uppercase tracking-wider">${subName}</h3>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="hidden sm:flex items-center gap-2.5 text-xs font-bold text-gray-400">
                            <span class="w-16 bg-white/5 h-1.5 rounded-full overflow-hidden"><span class="block ${subBgBar} h-full rounded-full" style="width: ${subPct}%"></span></span>
                            <span class="text-${subClass}">${subPct}%</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-500 text-xs transition duration-200 chevron-icon"></i>
                    </div>
                </div>
                <div class="tree-subject-content border-t border-white/5 p-4 space-y-4">
        `;

        const categories = {};
        topics.forEach(t => {
            const cat = t.category || "General";
            if (!categories[cat]) {
                categories[cat] = [];
            }
            categories[cat].push(t);
        });

        Object.keys(categories).forEach(catName => {
            html += `
                <div class="space-y-2">
                    <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-white/5 pb-1">${catName}</div>
            `;

            categories[catName].forEach(topicItem => {
                let topicDone = 0;
                topicItem.subtopics.forEach(s => {
                    const prog = appState.syllabusProgress[s.id];
                    if (prog && (prog.practiced || prog.mastered)) topicDone++;
                });

                html += `
                    <div class="border border-white/5 rounded-lg overflow-hidden" id="tree-topic-${topicItem.id}">
                        <div class="tree-topic-header flex items-center justify-between p-2.5 cursor-pointer hover:bg-white/2px select-none bg-white/2px">
                            <div class="flex items-center gap-2 text-xs font-semibold text-gray-200">
                                <i class="fa-solid fa-folder text-accentCyan"></i>
                                <span>${topicItem.topic}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded">${topicDone}/${topicItem.subtopics.length} Done</span>
                                <i class="fa-solid fa-chevron-right text-gray-600 text-[10px] transition duration-200"></i>
                            </div>
                        </div>
                        <div class="tree-topic-content hidden bg-black/10 border-t border-white/5 p-3 space-y-3">
                `;

                topicItem.subtopics.forEach(sub => {
                    const prog = appState.syllabusProgress[sub.id] || { learned: false, practiced: false, mastered: false };
                    const diffBadge = sub.difficulty === "Easy" ? "bg-accentGreen/10 border-accentGreen/20 text-accentGreen" :
                                      sub.difficulty === "Moderate" ? "bg-accentAmber/10 border-accentAmber/20 text-accentAmber" :
                                      "bg-accentRose/10 border-accentRose/20 text-accentRose";

                    const hasAlert = appState.weakAlerts && appState.weakAlerts[sub.id];
                    const alertBadge = hasAlert ? `<span class="red-alert-flag text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ml-1.5"><i class="fa-solid fa-triangle-exclamation mr-0.5 animate-pulse"></i> Red Alert</span>` : '';

                    html += `
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5 last:border-b-0 last:pb-0" data-id="${sub.id}">
                            <div class="space-y-1">
                                <div class="text-xs font-medium text-gray-200 flex items-center">${sub.name} ${alertBadge}</div>
                                <div class="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase">
                                    <span class="border px-1.5 py-0.5 rounded ${diffBadge}">${sub.difficulty}</span>
                                    <span class="bg-white/5 border border-white/5 px-1.5 py-0.5 rounded">${sub.weightage} Weight</span>
                                    <span>Effort: ${sub.effort}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-3.5 flex-wrap">
                                <label class="flex items-center gap-2 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                    <input type="checkbox" class="tree-cb-learned accent-accentCyan" data-id="${sub.id}" ${prog.learned ? 'checked' : ''}>
                                    <span>Learned</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                    <input type="checkbox" class="tree-cb-practiced accent-accentPurple" data-id="${sub.id}" ${prog.practiced ? 'checked' : ''}>
                                    <span>Practiced</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                    <input type="checkbox" class="tree-cb-mastered accent-accentGreen" data-id="${sub.id}" ${prog.mastered ? 'checked' : ''}>
                                    <span>Mastered</span>
                                </label>
                            </div>
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            });

            html += `</div>`; // Category end
        });

        html += `
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Attach subject toggle
    container.querySelectorAll(".tree-subject-header").forEach(header => {
        header.addEventListener("click", () => {
            const card = header.parentElement;
            const content = card.querySelector(".tree-subject-content");
            const icon = header.querySelector(".chevron-icon");
            
            content.classList.toggle("hidden");
            icon.classList.toggle("rotate-180");
        });
    });

    // Attach topic toggle
    container.querySelectorAll(".tree-topic-header").forEach(header => {
        header.addEventListener("click", () => {
            const row = header.parentElement;
            const content = row.querySelector(".tree-topic-content");
            const icon = header.querySelector(".fa-chevron-right");
            
            content.classList.toggle("hidden");
            icon.classList.toggle("rotate-90");
        });
    });

    // Checkbox toggling
    container.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const subId = cb.getAttribute("data-id");
            const isLearned = e.target.classList.contains("tree-cb-learned");
            const isPracticed = e.target.classList.contains("tree-cb-practiced");
            const isMastered = e.target.classList.contains("tree-cb-mastered");

            if (isLearned) appState.syllabusProgress[subId].learned = cb.checked;
            if (isPracticed) appState.syllabusProgress[subId].practiced = cb.checked;
            if (isMastered) appState.syllabusProgress[subId].mastered = cb.checked;

            if (cb.checked && (isPracticed || isMastered)) {
                if (appState.weakAlerts) delete appState.weakAlerts[subId];
            }

            saveStateToStorage();
            renderAll();
        });
    });
}

// Render Table Layout
function renderTableLayout(filteredData) {
    const tbody = document.getElementById("syllabus-table-body");
    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-xs text-gray-500 py-6">No topics matched your search parameters.</td></tr>`;
        return;
    }

    let html = "";
    filteredData.forEach(topic => {
        topic.subtopics.forEach(sub => {
            const prog = appState.syllabusProgress[sub.id] || { learned: false, practiced: false, mastered: false };
            const subClass = topic.subject === "Quantitative Aptitude" ? "text-accentCyan" :
                             topic.subject === "General Intelligence & Reasoning" ? "text-accentPurple" :
                             topic.subject === "English Language & Comprehension" ? "text-accentRose" : "text-accentAmber";

            const diffBadge = sub.difficulty === "Easy" ? "bg-accentGreen/10 border-accentGreen/20 text-accentGreen" :
                              sub.difficulty === "Moderate" ? "bg-accentAmber/10 border-accentAmber/20 text-accentAmber" :
                              "bg-accentRose/10 border-accentRose/20 text-accentRose";

            html += `
                <tr class="hover:bg-white/2px transition">
                    <td class="px-4 py-2.5">
                        <strong class="${subClass} font-heading text-[10px] tracking-wide block">${topic.subject}</strong>
                        <span class="text-gray-500 text-[9px] uppercase font-bold">${topic.category || 'Core'}</span>
                    </td>
                    <td class="px-4 py-2.5 font-semibold text-gray-200">${topic.topic}</td>
                    <td class="px-4 py-2.5 text-gray-300">
                        <span class="flex items-center gap-1.5">
                            ${sub.name}
                            ${(appState.weakAlerts && appState.weakAlerts[sub.id]) ? `<span class="red-alert-flag text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full"><i class="fa-solid fa-triangle-exclamation mr-0.5 animate-pulse"></i> Alert</span>` : ''}
                        </span>
                    </td>
                    <td class="px-4 py-2.5 text-center"><span class="border text-[9px] font-bold px-1.5 py-0.5 rounded ${diffBadge}">${sub.difficulty}</span></td>
                    <td class="px-4 py-2.5 text-center"><span class="bg-white/5 border border-white/5 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded">${sub.weightage}</span></td>
                    <td class="px-4 py-2.5">
                        <div class="flex items-center gap-3">
                            <label class="flex items-center gap-1 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                <input type="checkbox" class="tbl-cb-learned accent-accentCyan" data-id="${sub.id}" ${prog.learned ? 'checked' : ''}>
                                <span>L</span>
                            </label>
                            <label class="flex items-center gap-1 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                <input type="checkbox" class="tbl-cb-practiced accent-accentPurple" data-id="${sub.id}" ${prog.practiced ? 'checked' : ''}>
                                <span>P</span>
                            </label>
                            <label class="flex items-center gap-1 cursor-pointer text-[10px] text-gray-400 hover:text-white select-none">
                                <input type="checkbox" class="tbl-cb-mastered accent-accentGreen" data-id="${sub.id}" ${prog.mastered ? 'checked' : ''}>
                                <span>M</span>
                            </label>
                        </div>
                    </td>
                    <td class="px-4 py-2.5 text-right">
                        <button class="bg-white/5 hover:bg-accentGreen/10 border border-white/5 hover:border-accentGreen/20 text-gray-400 hover:text-accentGreen text-[10px] font-bold px-2 py-1 rounded transition table-quick-master" data-id="${sub.id}">
                            <i class="fa-solid fa-circle-check"></i> Master
                        </button>
                    </td>
                </tr>
            `;
        });
    });

    tbody.innerHTML = html;

    // Attach checkbox changes
    tbody.querySelectorAll("input[type='checkbox']").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const subId = cb.getAttribute("data-id");
            const isLearned = e.target.classList.contains("tbl-cb-learned");
            const isPracticed = e.target.classList.contains("tbl-cb-practiced");
            const isMastered = e.target.classList.contains("tbl-cb-mastered");

            if (isLearned) appState.syllabusProgress[subId].learned = cb.checked;
            if (isPracticed) appState.syllabusProgress[subId].practiced = cb.checked;
            if (isMastered) appState.syllabusProgress[subId].mastered = cb.checked;

            if (cb.checked && (isPracticed || isMastered)) {
                if (appState.weakAlerts) delete appState.weakAlerts[subId];
            }

            saveStateToStorage();
            renderAll();
        });
    });

    tbody.querySelectorAll(".table-quick-master").forEach(btn => {
        btn.onclick = () => {
            const subId = btn.getAttribute("data-id");
            appState.syllabusProgress[subId] = { learned: true, practiced: true, mastered: true };
            if (appState.weakAlerts) delete appState.weakAlerts[subId];
            saveStateToStorage();
            renderAll();
            renderTableLayout(filteredData);
        };
    });
}

// Render Card Layout
function renderCardsLayout(filteredData) {
    const container = document.getElementById("view-cards");
    if (filteredData.length === 0) {
        container.innerHTML = `<div class="bg-bgCard border border-white/5 rounded-xl p-5 text-center text-xs text-gray-500 shadow-md col-span-3">No topics matched your search parameters.</div>`;
        return;
    }

    let html = "";
    filteredData.forEach(topic => {
        const topicTotal = topic.subtopics.length;
        let learnedCount = 0;
        let practicedCount = 0;
        let masteredCount = 0;

        topic.subtopics.forEach(s => {
            const prog = appState.syllabusProgress[s.id];
            if (prog) {
                if (prog.learned) learnedCount++;
                if (prog.practiced) practicedCount++;
                if (prog.mastered) masteredCount++;
            }
        });

        let cardScore = Math.round(((masteredCount + (practicedCount * 0.6) + (learnedCount * 0.3)) / topicTotal) * 100);
        cardScore = Math.min(cardScore, 100);

        const subClass = topic.subject === "Quantitative Aptitude" ? "text-accentCyan" :
                         topic.subject === "General Intelligence & Reasoning" ? "text-accentPurple" :
                         topic.subject === "English Language & Comprehension" ? "text-accentRose" : "text-accentAmber";

        html += `
            <div class="bg-bgCard border border-white/5 rounded-xl p-4 shadow hover:border-white/10 transition duration-300 flex flex-col gap-3">
                <div class="flex justify-between items-start">
                    <div>
                        <span class="text-[9px] font-bold uppercase ${subClass}">${topic.subject}</span>
                        <h3 class="text-xs font-bold text-white mt-0.5">${topic.topic}</h3>
                    </div>
                    <span class="bg-white/5 border border-white/5 px-2 py-0.5 text-[9px] font-bold text-gray-400 uppercase rounded">${topic.category || 'Core'}</span>
                </div>
                
                <div class="grid grid-cols-2 gap-2 text-[10px] bg-white/2px p-2.5 rounded-lg border border-white/5">
                    <div><span class="text-gray-500 block">Total Chapters</span><span class="font-bold text-gray-200">${topicTotal}</span></div>
                    <div><span class="text-gray-500 block">Mastered</span><span class="font-bold text-accentGreen">${masteredCount}/${topicTotal}</span></div>
                    <div><span class="text-gray-500 block">Practiced</span><span class="font-bold text-accentPurple">${practicedCount}/${topicTotal}</span></div>
                    <div><span class="text-gray-500 block">Learned</span><span class="font-bold text-accentCyan">${learnedCount}/${topicTotal}</span></div>
                </div>

                <div class="space-y-1 mt-1">
                    <div class="flex justify-between items-center text-[10px] font-bold">
                        <span class="text-gray-400">Readiness Score</span>
                        <span class="${subClass}">${cardScore}%</span>
                    </div>
                    <div class="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div class="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full" style="width: ${cardScore}%;"></div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// 8. INTERACTIVE SVG MIND MAP VIEWER ENGINE
// Zoom, Pan & Drag canvas states
let mmZoom = 0.8;
let mmPanX = 100;
let mmPanY = 80;
let mmIsDragging = false;
let mmDragStart = { x: 0, y: 0 };

function renderMindMap(filteredData = SYLLABUS_DATA) {
    const containerG = document.getElementById("mindmap-g");
    containerG.innerHTML = "";

    if (filteredData.length === 0) {
        containerG.innerHTML = `<text x="50" y="50" fill="var(--text-sub)" font-size="12">No nodes found...</text>`;
        return;
    }

    // Build hierarchical radial/horizontal tree map
    const root = { id: "root", name: "SSC CGL", x: 60, y: 250, type: "root", children: [] };
    const subjectsMap = {};

    filteredData.forEach(topic => {
        if (!subjectsMap[topic.subject]) {
            subjectsMap[topic.subject] = { id: "sub-" + topic.subject.replace(/\s+/g, '-'), name: topic.subject, type: "subject", children: [] };
            root.children.push(subjectsMap[topic.subject]);
        }
        const topicNode = { id: "topic-" + topic.id, name: topic.topic, type: "topic", subtopics: topic.subtopics };
        subjectsMap[topic.subject].children.push(topicNode);
    });

    const totalSubjects = root.children.length;
    let currentTopicY = 20;
    const verticalGap = 40;

    root.children.forEach((sub, subIdx) => {
        sub.x = 260;
        sub.y = 80 + (subIdx * (400 / Math.max(totalSubjects - 1, 1)));
        if (totalSubjects === 1) sub.y = 250;

        sub.children.forEach(topicNode => {
            topicNode.x = 480;
            topicNode.y = currentTopicY + (verticalGap * 0.8);
            currentTopicY += verticalGap;
        });
        currentTopicY += 15;
    });

    // Draw Links
    let linksHtml = "";
    root.children.forEach(sub => {
        let isSubComp = true;
        sub.children.forEach(t => {
            t.subtopics.forEach(s => {
                const p = appState.syllabusProgress[s.id];
                if (!p || (!p.practiced && !p.mastered)) isSubComp = false;
            });
        });

        linksHtml += drawBezierLink(root.x, root.y, sub.x, sub.y, isSubComp);

        sub.children.forEach(topicNode => {
            let isTopicComp = true;
            topicNode.subtopics.forEach(s => {
                const p = appState.syllabusProgress[s.id];
                if (!p || (!p.practiced && !p.mastered)) isTopicComp = false;
            });

            linksHtml += drawBezierLink(sub.x, sub.y, topicNode.x, topicNode.y, isTopicComp);
        });
    });

    // Draw Nodes
    let nodesHtml = renderSvgNode(root);

    root.children.forEach(sub => {
        let done = 0, tot = 0;
        sub.children.forEach(t => {
            t.subtopics.forEach(s => {
                tot++;
                const p = appState.syllabusProgress[s.id];
                if (p && (p.practiced || p.mastered)) done++;
            });
        });
        const completionClass = done === tot && tot > 0 ? "mastered-node" : done > 0 ? "practiced-node" : "";

        nodesHtml += renderSvgNode(sub, completionClass, `${done}/${tot}`);

        sub.children.forEach(topicNode => {
            let tDone = 0, tTot = topicNode.subtopics.length;
            let hasTopicAlert = false;
            topicNode.subtopics.forEach(s => {
                const p = appState.syllabusProgress[s.id];
                if (p && (p.practiced || p.mastered)) tDone++;
                if (appState.weakAlerts && appState.weakAlerts[s.id]) hasTopicAlert = true;
            });
            let tCompClass = tDone === tTot && tTot > 0 ? "mastered-node" : tDone > 0 ? "practiced-node" : "";
            if (hasTopicAlert) tCompClass += " alert-node";

            nodesHtml += renderSvgNode(topicNode, tCompClass, `${tDone}/${tTot}`);
        });
    });

    containerG.innerHTML = linksHtml + nodesHtml;
    updateMindMapTransform();
    initMindMapInteraction();
}

function drawBezierLink(x1, y1, x2, y2, isCompleted) {
    const cp1 = x1 + (x2 - x1) / 2;
    const cp2 = cp1;
    const strokeClass = isCompleted ? "mm-link completed-branch" : "mm-link";
    return `<path d="M ${x1} ${y1} C ${cp1} ${y1}, ${cp2} ${y2}, ${x2} ${y2}" class="${strokeClass}" />`;
}

function renderSvgNode(node, statusClass = "", progressText = "") {
    const extraClass = node.type + " " + statusClass;
    let label = node.name;
    if (label.length > 20) {
        label = label.substring(0, 18) + "...";
    }

    let textOffsetX = 20;
    let textAnchor = "start";
    if (node.type === "root") {
        textOffsetX = -20;
        textAnchor = "end";
    }

    return `
        <g class="mm-node ${extraClass} select-none cursor-pointer" transform="translate(${node.x}, ${node.y})" data-id="${node.id}" data-type="${node.type}">
            <circle cx="0" cy="0" />
            <text x="${textOffsetX}" y="4" text-anchor="${textAnchor}" class="font-heading">${label} ${progressText ? `(${progressText})` : ''}</text>
        </g>
    `;
}

function updateMindMapTransform() {
    const containerG = document.getElementById("mindmap-g");
    containerG.setAttribute("transform", `translate(${mmPanX}, ${mmPanY}) scale(${mmZoom})`);
}

function initMindMapInteraction() {
    const svg = document.getElementById("mindmap-svg");
    const container = document.getElementById("mindmap-container");

    const btnReset = document.getElementById("btn-mm-reset");
    const btnZoomIn = document.getElementById("btn-mm-zoomin");
    const btnZoomOut = document.getElementById("btn-mm-zoomout");

    btnReset.onclick = () => {
        mmZoom = 0.8; mmPanX = 100; mmPanY = 80;
        updateMindMapTransform();
    };
    btnZoomIn.onclick = () => { mmZoom += 0.1; updateMindMapTransform(); };
    btnZoomOut.onclick = () => { mmZoom = Math.max(0.3, mmZoom - 0.1); updateMindMapTransform(); };

    // Canvas Panning dragging
    container.onmousedown = (e) => {
        if (e.target.tagName === "circle" || e.target.tagName === "text") return;
        mmIsDragging = true;
        mmDragStart.x = e.clientX - mmPanX;
        mmDragStart.y = e.clientY - mmPanY;
    };

    window.onmousemove = (e) => {
        if (!mmIsDragging) return;
        mmPanX = e.clientX - mmDragStart.x;
        mmPanY = e.clientY - mmDragStart.y;
        updateMindMapTransform();
    };

    window.onmouseup = () => { mmIsDragging = false; };

    // Scroll zoom
    container.onwheel = (e) => {
        e.preventDefault();
        if (e.deltaY < 0) mmZoom += 0.05;
        else mmZoom = Math.max(0.3, mmZoom - 0.05);
        updateMindMapTransform();
    };

    // Node click redirects to accordion Tree view
    svg.querySelectorAll(".mm-node").forEach(node => {
        node.onclick = (e) => {
            e.stopPropagation();
            const nodeId = node.getAttribute("data-id");
            const nodeType = node.getAttribute("data-type");

            if (nodeType === "topic") {
                const topicId = nodeId.replace("topic-", "");
                
                // Toggle mode select
                document.getElementById("view-mode-select").value = "tree";
                document.getElementById("view-tree").classList.remove("hidden");
                document.getElementById("view-mindmap").classList.add("hidden");

                renderSyllabus();

                setTimeout(() => {
                    const treeRow = document.getElementById(`tree-topic-${topicId}`);
                    if (treeRow) {
                        const content = treeRow.querySelector(".tree-topic-content");
                        const icon = treeRow.querySelector(".fa-chevron-right");
                        
                        content.classList.remove("hidden");
                        if (icon) icon.classList.add("rotate-90");
                        
                        treeRow.scrollIntoView({ behavior: "smooth", block: "center" });
                        
                        // Brief glow outline highlight
                        treeRow.classList.add("ring-2", "ring-accentCyan", "shadow-lg");
                        setTimeout(() => {
                            treeRow.classList.remove("ring-2", "ring-accentCyan", "shadow-lg");
                        }, 2000);
                    }
                }, 100);
            }
        };
    });
}

// 9. 40-DAY STUDY PLANTIMELINE VIEW
function renderStudyPlan() {
    const container = document.getElementById("plan-days-container");
    const activeTab = document.querySelector(".phase-tab-btn.active");
    const activePhase = activeTab ? parseInt(activeTab.getAttribute("data-phase")) : 1;

    const filteredDays = PLAN_DATA.filter(d => d.phase === activePhase);
    
    // Plan complete calculations
    const totalDays = PLAN_DATA.length;
    const completedDays = PLAN_DATA.filter(d => d.day < appState.currentDay).length;
    const planPct = Math.round((completedDays / totalDays) * 100);
    
    document.getElementById("plan-pct").innerText = `${planPct}% (${completedDays}/${totalDays} Completed)`;
    document.getElementById("plan-pct-fill").style.width = planPct + "%";

    let html = "";
    
    filteredDays.forEach(dayItem => {
        const isCompleted = dayItem.day < appState.currentDay;
        const isToday = dayItem.day === appState.currentDay;
        
        let cardBorderClass = "border-white/5";
        let cardBgClass = "bg-bgCard";
        
        if (isCompleted) {
            cardBorderClass = "border-accentGreen/30";
            cardBgClass = "bg-bgCard/80";
        } else if (isToday) {
            cardBorderClass = "border-accentPurple/80 shadow-violet-500/5 ring-1 ring-accentPurple/20";
            cardBgClass = "bg-white/2px";
        }

        let badgeHtml = "";
        if (dayItem.dayType === "test" || dayItem.targets.length === 0) {
            badgeHtml = `<span class="bg-accentRose/15 text-accentRose px-2 py-0.5 rounded text-[9px] font-bold uppercase"><i class="fa-solid fa-trophy mr-1"></i> Simulation Mock</span>`;
        } else {
            badgeHtml = `<span class="bg-accentCyan/15 text-accentCyan px-2 py-0.5 rounded text-[9px] font-bold uppercase">${dayItem.targets.length} Chapters</span>`;
        }

        const expandedClass = isToday ? "block" : "hidden";
        const chevronClass = isToday ? "rotate-180" : "";

        html += `
            <div class="bg-bgCard border ${cardBorderClass} rounded-xl shadow-md overflow-hidden transition-all duration-300" id="plan-day-card-${dayItem.day}">
                <div class="flex items-center justify-between p-4 cursor-pointer hover:bg-white/2px select-none" onclick="togglePlanDay(${dayItem.day})">
                    <div class="flex items-center gap-3.5">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center font-heading font-extrabold text-xs border ${isCompleted ? 'bg-accentGreen/15 border-accentGreen text-accentGreen' : isToday ? 'bg-accentPurple/15 border-accentPurple text-accentPurple' : 'bg-white/5 border-white/10 text-gray-400'}">${dayItem.day}</div>
                        <div>
                            <h3 class="text-xs font-bold text-white flex items-center gap-1.5">${dayItem.name} ${isToday ? '<span class="text-accentCyan text-[9px] font-extrabold uppercase">&bull; Active Today</span>' : ''}</h3>
                            <p class="text-[11px] text-gray-500 max-w-lg mt-0.5">${dayItem.desc}</p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-3">
                        <div class="hidden sm:flex gap-1.5">
                            ${badgeHtml}
                            <span class="bg-white/5 border border-white/5 text-gray-400 px-2 py-0.5 rounded text-[9px] font-bold uppercase"><i class="fa-solid fa-hourglass mr-1"></i> ${dayItem.time}</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-500 text-xs transition duration-200 plan-chevron-${dayItem.day} ${chevronClass}"></i>
                    </div>
                </div>
                
                <div class="plan-day-content ${expandedClass} border-t border-white/5 p-4 bg-black/10">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                        <div class="space-y-3">
                            <h4 class="font-bold text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/5 pb-1">Topic Targets Checklist</h4>
                            <div class="space-y-2">
        `;

        if (dayItem.targets.length === 0) {
            html += `
                <div class="flex gap-2 text-gray-400">
                    <i class="fa-solid fa-triangle-exclamation text-accentAmber text-xs mt-0.5"></i>
                    <span>No chapter lessons. Complete mock: <strong>${dayItem.test}</strong></span>
                </div>
            `;
        } else {
            dayItem.targets.forEach(targetId => {
                let subFound = null;
                for (const topic of SYLLABUS_DATA) {
                    const sub = topic.subtopics.find(s => s.id === targetId);
                    if (sub) {
                        subFound = sub;
                        break;
                    }
                }

                if (subFound) {
                    const prog = appState.syllabusProgress[subFound.id] || { learned: false, practiced: false, mastered: false };
                    const checkedStr = (prog.practiced || prog.mastered) ? "checked" : "";
                    
                    html += `
                        <label class="flex items-start gap-2.5 cursor-pointer text-gray-300 hover:text-white select-none">
                            <input type="checkbox" id="plan-cb-${subFound.id}" data-id="${subFound.id}" ${checkedStr} class="plan-subtopic-toggle mt-0.5 accent-accentCyan">
                            <span><strong>${subFound.name}</strong> <span class="text-gray-500 text-[10px]">(${subFound.difficulty} | Weight: ${subFound.weightage})</span></span>
                        </label>
                    `;
                }
            });
        }

        html += `
                            </div>
                        </div>

                        <!-- Right list -->
                        <div class="space-y-3">
                            <h4 class="font-bold text-gray-400 uppercase text-[10px] tracking-wider border-b border-white/5 pb-1">Drills & Test Target</h4>
                            <div class="space-y-2 text-gray-400">
                                <div class="flex gap-2"><i class="fa-solid fa-bolt text-accentCyan mt-0.5"></i> <span>Tables, fraction conversions and speed formulas drills (20 mins).</span></div>
                                <div class="flex gap-2"><i class="fa-solid fa-book text-accentRose mt-0.5"></i> <span>Vocabulary rules & synonyms cards from Study Toolkit (15 mins).</span></div>
                                <div class="flex gap-2"><i class="fa-solid fa-trophy text-accentAmber mt-0.5"></i> <span><strong>Target Test:</strong> ${dayItem.test}</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end items-center gap-2 mt-4 pt-4 border-t border-white/5">
                        <button class="bg-white/5 hover:bg-white/10 text-gray-300 px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-white/5 transition" onclick="openDayDetailModal(${dayItem.day})">
                            <i class="fa-solid fa-eye"></i> Reference Guide
                        </button>
                        ${isToday ? `
                            <button class="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow transition" onclick="completeActiveDay()">
                                <i class="fa-solid fa-circle-check"></i> Complete & Advance
                            </button>
                        ` : isCompleted ? `
                            <button class="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold border border-white/5 transition" onclick="resetActiveDayTo(${dayItem.day})">
                                <i class="fa-solid fa-rotate-left"></i> Reset Roadmap to here
                            </button>
                        ` : `
                            <button class="bg-white/5 text-gray-600 px-4 py-1.5 rounded-lg text-xs font-semibold border border-white/5 cursor-not-allowed" disabled>Locked</button>
                        `}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    // Attach timeline phase tab clicks
    const tabBtns = document.querySelectorAll(".phase-tab-btn");
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => {
                b.classList.remove("active");
                b.querySelector("span").className = "text-xs font-bold text-gray-300";
            });
            btn.classList.add("active");
            btn.querySelector("span").className = "text-xs font-bold text-white";
            
            renderStudyPlan();
        };
    });

    // Checkbox toggling inside Plan list
    container.querySelectorAll(".plan-subtopic-toggle").forEach(cb => {
        cb.addEventListener("change", (e) => {
            const subId = cb.getAttribute("data-id");
            if (!appState.syllabusProgress[subId]) {
                appState.syllabusProgress[subId] = { learned: false, practiced: false, mastered: false };
            }
            appState.syllabusProgress[subId].learned = cb.checked;
            appState.syllabusProgress[subId].practiced = cb.checked;
            
            saveStateToStorage();
            renderAll();
        });
    });
    
    // Trigger LaTeX typesetting
    setTimeout(triggerMathTypesetting, 50);
}

function togglePlanDay(dayNum) {
    const card = document.getElementById(`plan-day-card-${dayNum}`);
    const content = card.querySelector(".plan-day-content");
    const icon = card.querySelector(`.plan-chevron-${dayNum}`);
    
    if (content) {
        content.classList.toggle("hidden");
        icon.classList.toggle("rotate-180");
    }
}

function completeActiveDay() {
    if (appState.currentDay < PLAN_DATA.length) {
        appState.dailyRituals = { drill: false, vocab: false, ca: false, computer: false };
        appState.currentDay++;
        saveStateToStorage();
        renderAll();

        speakText(`Success! Day ${appState.currentDay - 1} completed. Welcome to Day ${appState.currentDay}!`);

        const nextDayData = PLAN_DATA.find(d => d.day === appState.currentDay);
        if (nextDayData) {
            const tab = document.querySelector(`.phase-tab-btn[data-phase="${nextDayData.phase}"]`);
            if (tab) {
                document.querySelectorAll(".phase-tab-btn").forEach(b => b.classList.remove("active"));
                tab.classList.add("active");
            }
        }
        renderStudyPlan();
    } else {
        speakText("Congratulations! You have completed the 40-day course!");
    }
}

function resetActiveDayTo(dayNum) {
    if (confirm(`Reset preparation progress back to Day ${dayNum}?`)) {
        appState.currentDay = dayNum;
        appState.dailyRituals = { drill: false, vocab: false, ca: false, computer: false };
        saveStateToStorage();
        renderAll();
        renderStudyPlan();
    }
}

// Complete day trigger in Dashboard view
document.getElementById("btn-complete-day").onclick = () => {
    completeActiveDay();
};

// 10. MOCK TEST SCORE LOGS AND GRAPH
function initForms() {
    // Populate weak areas select dropdown
    const weakTopicSelect = document.getElementById("mock-weak-topic");
    if (weakTopicSelect) {
        let options = '<option value="">-- No Weak Topic Selected --</option>';
        SYLLABUS_DATA.forEach(topic => {
            topic.subtopics.forEach(sub => {
                options += `<option value="${sub.id}">${topic.subject} - ${sub.name}</option>`;
            });
        });
        weakTopicSelect.innerHTML = options;
    }

    const mockForm = document.getElementById("form-mock");
    mockForm.onsubmit = (e) => {
        e.preventDefault();
        
        const name = document.getElementById("mock-name").value;
        const date = document.getElementById("mock-date").value;
        const score = parseFloat(document.getElementById("mock-score").value);
        const accuracy = parseFloat(document.getElementById("mock-accuracy").value) || null;
        const rank = document.getElementById("mock-rank").value || "N/A";
        
        const qScore = parseFloat(document.getElementById("score-quant").value) || 0;
        const rScore = parseFloat(document.getElementById("score-reasoning").value) || 0;
        const eScore = parseFloat(document.getElementById("score-english").value) || 0;
        const gaScore = parseFloat(document.getElementById("score-ga").value) || 0;
        
        const notes = document.getElementById("mock-notes").value;
        const weakTopicId = document.getElementById("mock-weak-topic").value;

        const newMock = {
            id: "mock-" + Date.now(),
            name, date, score, accuracy, rank,
            breakdown: { quant: qScore, reasoning: rScore, english: eScore, ga: gaScore },
            notes,
            weakTopicId
        };

        appState.mocks.push(newMock);
        appState.mocks.sort((a,b) => new Date(a.date) - new Date(b.date));
        
        if (weakTopicId) {
            if (!appState.weakAlerts) appState.weakAlerts = {};
            appState.weakAlerts[weakTopicId] = true;
        }

        saveStateToStorage();
        mockForm.reset();
        if (weakTopicSelect) weakTopicSelect.value = "";
        
        renderAll();
        renderMockAnalytics();
        speakText("Mock score logged successfully.");
    };

    // Note logs form inside Study toolkit Custom Notes tab
    const noteForm = document.getElementById("form-note");
    const noteContentInput = document.getElementById("note-content");
    const latexPreview = document.getElementById("latex-preview");

    if (noteContentInput && latexPreview) {
        noteContentInput.addEventListener("input", () => {
            const val = noteContentInput.value.trim();
            latexPreview.innerText = val || "Type math formulas inside $...$ to preview render...";
            if (window.renderMathInElement && val) {
                window.renderMathInElement(latexPreview, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            }
        });
    }

    noteForm.onsubmit = (e) => {
        e.preventDefault();
        
        const title = document.getElementById("note-title").value;
        const category = document.getElementById("note-category").value;
        const subject = document.getElementById("note-subject").value;
        const content = noteContentInput.value;

        const newNote = {
            id: "note-" + Date.now(),
            title, category, subject, content,
            date: new Date().toLocaleDateString()
        };

        appState.notes.push(newNote);
        saveStateToStorage();
        noteForm.reset();
        if (latexPreview) {
            latexPreview.innerText = "Type math formulas inside $...$ to preview render...";
        }
        
        renderToolkit();
        speakText("Note saved to toolkit.");
    };
}

function renderMockAnalytics() {
    const tbody = document.getElementById("mock-table-body");
    
    if (appState.mocks.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-xs text-gray-500 py-6">No mocks taken yet. Log your first mock!</td></tr>`;
        renderSvgMockChart([]);
        return;
    }

    let html = "";
    appState.mocks.forEach(m => {
        const accuracyText = m.accuracy ? m.accuracy + "%" : "N/A";
        const bd = m.breakdown;
        const breakupText = (bd.quant || bd.reasoning || bd.english || bd.ga) ? 
                            `${bd.quant}/${bd.reasoning}/${bd.english}/${bd.ga}` : "N/A";

        html += `
            <tr class="hover:bg-white/2px transition">
                <td class="px-3 py-2 text-gray-400">${m.date}</td>
                <td class="px-3 py-2"><strong class="text-white">${m.name}</strong><br><span class="text-[9px] text-gray-500 font-bold uppercase">Rank: ${m.rank}</span></td>
                <td class="px-3 py-2 font-heading font-extrabold text-accentCyan">${m.score}</td>
                <td class="px-3 py-2 text-center text-gray-400">${breakupText}</td>
                <td class="px-3 py-2 text-right">
                    <button class="text-gray-500 hover:text-accentRose px-2 transition" onclick="deleteMock('${m.id}')">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    const totalScore = appState.mocks.reduce((acc, m) => acc + parseFloat(m.score), 0);
    const maxScore = appState.mocks.reduce((max, m) => Math.max(max, parseFloat(m.score)), 0);
    const avgScore = (totalScore / appState.mocks.length).toFixed(1);

    const loggedAccuracies = appState.mocks.filter(m => m.accuracy !== null);
    let avgAccuracy = 0;
    if (loggedAccuracies.length > 0) {
        const sumAcc = loggedAccuracies.reduce((acc, m) => acc + parseFloat(m.accuracy), 0);
        avgAccuracy = Math.round(sumAcc / loggedAccuracies.length);
    }

    document.getElementById("metric-avg-score").innerText = avgScore;
    document.getElementById("metric-max-score").innerText = maxScore.toFixed(1);
    document.getElementById("metric-avg-accuracy").innerText = avgAccuracy + "%";

    renderSvgMockChart(appState.mocks);
}

function deleteMock(mockId) {
    if (confirm("Delete this mock record?")) {
        appState.mocks = appState.mocks.filter(m => m.id !== mockId);
        saveStateToStorage();
        renderAll();
        renderMockAnalytics();
    }
}

function renderSvgMockChart(mocksList) {
    const svg = document.getElementById("analytics-svg-chart");
    svg.innerHTML = "";

    const width = svg.clientWidth || 400;
    const height = 200;
    const padding = 35;
    
    // Draw Y-axis grid markers
    const gridScores = [50, 100, 150, 200];
    gridScores.forEach(score => {
        const y = height - padding - ((score / 200) * (height - 2 * padding));
        svg.innerHTML += `
            <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
            <text x="${padding - 5}" y="${y + 4}" fill="#6b7280" font-size="8" font-family="monospace" text-anchor="end">${score}</text>
        `;
    });

    // Draw safety cutoff target line (140)
    const targetY = height - padding - ((140 / 200) * (height - 2 * padding));
    svg.innerHTML += `
        <line x1="${padding}" y1="${targetY}" x2="${width - padding}" y2="${targetY}" stroke="rgba(16,185,129,0.3)" stroke-width="1.5" stroke-dasharray="3,3" />
        <text x="${width - padding - 5}" y="${targetY - 5}" fill="#10b981" font-size="7" font-weight="bold" text-anchor="end">Target Cutoff (140)</text>
    `;

    if (mocksList.length === 0) {
        svg.innerHTML += `<text x="${width/2}" y="${height/2}" fill="#6b7280" text-anchor="middle" font-size="10">Log mock tests to render progress metrics</text>`;
        return;
    }

    const points = [];
    const count = mocksList.length;
    
    mocksList.forEach((mock, idx) => {
        const x = padding + (idx * ((width - 2 * padding) / Math.max(count - 1, 1)));
        const y = height - padding - ((mock.score / 200) * (height - 2 * padding));
        points.push({ x, y, score: mock.score, name: mock.name });
    });

    if (count > 1) {
        let pathD = `M ${points[0].x} ${points[0].y}`;
        for (let i = 1; i < points.length; i++) {
            pathD += ` L ${points[i].x} ${points[i].y}`;
        }
        svg.innerHTML += `<path d="${pathD}" fill="none" stroke="#06b6d4" stroke-width="2.5" stroke-linecap="round" />`;
    }

    points.forEach(pt => {
        svg.innerHTML += `
            <g style="cursor:pointer;">
                <circle cx="${pt.x}" cy="${pt.y}" r="4" fill="#151526" stroke="#06b6d4" stroke-width="2" />
                <title>${pt.name}: ${pt.score}/200</title>
            </g>
        `;
    });
}

// 11. STOPWATCH SESSION STUDY & POMODORO TIMER
function initSessionTimer() {
    const btnToggle = document.getElementById("btn-toggle-session");
    const btnReset = document.getElementById("btn-reset-session");
    const timeDisplay = document.getElementById("session-time");

    btnToggle.onclick = () => {
        if (appState.sessionActive) {
            appState.sessionActive = false;
            clearInterval(sessionTimerInterval);
            btnToggle.innerHTML = '<i class="fa-solid fa-play text-accentCyan"></i> Start Timer';
            saveStateToStorage();
        } else {
            appState.sessionActive = true;
            btnToggle.innerHTML = '<i class="fa-solid fa-pause text-accentRose"></i> Pause';
            sessionTimerInterval = setInterval(() => {
                appState.sessionTime++;
                timeDisplay.innerText = formatTimeSeconds(appState.sessionTime);
                if (appState.sessionTime % 60 === 0) saveStateToStorage();
            }, 1000);
        }
    };

    btnReset.onclick = () => {
        if (confirm("Reset current session timer?")) {
            appState.sessionActive = false;
            clearInterval(sessionTimerInterval);
            appState.sessionTime = 0;
            timeDisplay.innerText = "00:00:00";
            btnToggle.innerHTML = '<i class="fa-solid fa-play text-accentCyan"></i> Start Timer';
            saveStateToStorage();
        }
    };

    if (appState.sessionActive) {
        appState.sessionActive = false;
        btnToggle.click();
    } else {
        timeDisplay.innerText = formatTimeSeconds(appState.sessionTime);
    }
}

function formatTimeSeconds(secs) {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;
    return [hours, minutes, seconds].map(v => v.toString().padStart(2, "0")).join(":");
}

function initPomoTimer() {
    const btnStart = document.getElementById("btn-pomo-start");
    const btnPause = document.getElementById("btn-pomo-pause");
    const btnReset = document.getElementById("btn-pomo-reset");
    const timeDisplay = document.getElementById("pomo-time-display");
    const ringFill = document.getElementById("pomo-progress");
    const statusLabel = document.getElementById("pomo-status-label");
    const modesButtons = document.querySelectorAll(".btn-pomo-mode");

    let initialTime = appState.pomoTime;

    const updatePomoDisplay = () => {
        const mins = Math.floor(appState.pomoTime / 60);
        const secs = appState.pomoTime % 60;
        timeDisplay.innerText = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
        
        const pct = appState.pomoTime / initialTime;
        const offset = pomoRingCircumference * (1 - pct);
        ringFill.style.strokeDashoffset = isNaN(offset) ? 0 : offset;
    };

    btnStart.onclick = () => {
        appState.pomoActive = true;
        btnStart.disabled = true;
        btnPause.disabled = false;
        
        pomoTimerInterval = setInterval(() => {
            if (appState.pomoTime > 0) {
                appState.pomoTime--;
                updatePomoDisplay();
            } else {
                clearInterval(pomoTimerInterval);
                appState.pomoActive = false;
                btnStart.disabled = false;
                btnPause.disabled = true;
                
                speakText("Focus timer completed. Great job, soldier! Take a rest break.");
                appState.pomoTime = initialTime;
                updatePomoDisplay();
            }
        }, 1000);
    };

    btnPause.onclick = () => {
        appState.pomoActive = false;
        btnStart.disabled = false;
        btnPause.disabled = true;
        clearInterval(pomoTimerInterval);
    };

    btnReset.onclick = () => {
        appState.pomoActive = false;
        btnStart.disabled = false;
        btnPause.disabled = true;
        clearInterval(pomoTimerInterval);
        appState.pomoTime = initialTime;
        updatePomoDisplay();
    };

    modesButtons.forEach(btn => {
        btn.onclick = () => {
            modesButtons.forEach(b => b.classList.remove("active-nav-tab"));
            btn.classList.add("active-nav-tab");
            
            const seconds = parseInt(btn.getAttribute("data-time"));
            const mode = btn.getAttribute("data-mode");
            
            appState.pomoMode = mode;
            initialTime = seconds;
            appState.pomoTime = seconds;
            
            statusLabel.innerText = mode === "study" ? "STUDY TIME" : "REST BREAK";
            ringFill.style.stroke = mode === "study" ? "var(--accent-rose)" : "var(--accent-green)";
            
            btnReset.click();
        };
    });

    updatePomoDisplay();
}

function speakText(txt) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(txt);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

// 12. STUDY NOTES LOGIC (MISTAKE BOOK / CUSTOM NOTES)
function renderToolkit() {
    const container = document.getElementById("notes-container");
    const activeBtn = document.querySelector(".note-filter-btn.active-nav-tab");
    const category = activeBtn ? activeBtn.getAttribute("data-category") : "all";

    const filtered = category === "all" ? 
                     appState.notes : 
                     appState.notes.filter(n => n.category === category);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="text-center text-xs text-gray-500 py-6">No custom notes saved under this tab. Create one using the form above!</div>`;
        return;
    }

    let html = "";
    filtered.forEach(n => {
        const catLabel = n.category === "mistake" ? "Mistake Book" : n.category === "formula" ? "Formula/Trick" : "Static GK";
        const catBorder = n.category === "mistake" ? "border-l-accentRose" : n.category === "formula" ? "border-l-accentCyan" : "border-l-accentAmber";
        
        html += `
            <div class="bg-white/2px border-l-2 ${catBorder} border-t border-r border-b border-white/5 rounded-lg p-3 relative hover:bg-white/5 transition">
                <div class="flex justify-between items-start gap-2">
                    <h5 class="text-xs font-bold text-white">${n.title}</h5>
                    <button class="text-gray-500 hover:text-accentRose text-xs" onclick="deleteNote('${n.id}')" title="Delete Note">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <div class="text-[9px] text-gray-500 font-semibold uppercase mt-0.5">Subject: ${n.subject} &bull; ${catLabel} &bull; ${n.date}</div>
                <div class="text-[11px] text-gray-300 mt-2 whitespace-pre-wrap">${n.content}</div>
            </div>
        `;
    });

    container.innerHTML = html;
    
    // Trigger LaTeX typesetting
    setTimeout(triggerMathTypesetting, 50);
}

function deleteNote(id) {
    if (confirm("Delete this note?")) {
        appState.notes = appState.notes.filter(n => n.id !== id);
        saveStateToStorage();
        renderToolkit();
    }
}

// 13. MODALS AND DETAILS MANAGEMENT
function initModals() {
    const closeBtns = document.querySelectorAll(".modal-close-btn");
    closeBtns.forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
        };
    });

    window.onclick = (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.classList.remove("active");
        }
    };
}

function openDayDetailModal(dayNum) {
    const modal = document.getElementById("modal-day-detail");
    const dayData = PLAN_DATA.find(d => d.day === dayNum);
    
    if (!dayData) return;

    document.getElementById("md-day-num").innerText = dayNum;
    
    let phaseTitle = "Phase 1: Foundations";
    if (dayData.phase === 2) phaseTitle = "Phase 2: Applications & Practice";
    else if (dayData.phase === 3) phaseTitle = "Phase 3: Advanced Math (Tier 2 Level)";
    else if (dayData.phase === 4) phaseTitle = "Phase 4: Simulation Mock Runs";

    document.getElementById("md-phase-title").innerText = `${phaseTitle} (Day ${dayNum} of 40)`;
    document.getElementById("md-day-description").innerText = dayData.desc;
    document.getElementById("md-total-time").innerText = dayData.time + " Est.";
    document.getElementById("md-total-tasks").innerText = (dayData.targets.length > 0 ? dayData.targets.length : "Full Mock") + " Targets";

    const listContainer = document.getElementById("md-topics-list-container");
    listContainer.innerHTML = "";

    if (dayData.targets.length === 0) {
        listContainer.innerHTML = `
            <div class="p-3 bg-accentRose/10 border border-accentRose/20 rounded-lg text-xs text-rose-300">
                <i class="fa-solid fa-trophy mr-1 text-accentRose"></i> Mock Challenge: <strong>${dayData.test}</strong>
            </div>
        `;
    } else {
        dayData.targets.forEach(targetId => {
            let sub = null;
            let parentTopic = null;
            
            for (const t of SYLLABUS_DATA) {
                sub = t.subtopics.find(s => s.id === targetId);
                if (sub) { parentTopic = t; break; }
            }

            if (sub && parentTopic) {
                const prog = appState.syllabusProgress[sub.id] || { learned: false, practiced: false, mastered: false };
                const stateText = prog.mastered ? 'MASTERED' : prog.practiced ? 'PRACTICED' : prog.learned ? 'LEARNED' : 'NOT STARTED';
                const stateColor = prog.mastered ? 'text-accentGreen' : prog.practiced ? 'text-accentPurple' : prog.learned ? 'text-accentCyan' : 'text-gray-500';

                listContainer.innerHTML += `
                    <div class="p-3 bg-white/2px border border-white/5 rounded-lg flex justify-between items-center text-xs">
                        <div>
                            <div class="font-bold text-gray-200">${sub.name}</div>
                            <div class="text-[9px] text-gray-500 font-bold uppercase mt-0.5">${parentTopic.subject} &bull; ${sub.difficulty}</div>
                        </div>
                        <div class="font-extrabold text-[10px] ${stateColor}">${stateText}</div>
                    </div>
                `;
            }
        });
    }

    const btnMarkComplete = document.getElementById("md-btn-mark-complete");
    if (dayNum === appState.currentDay) {
        btnMarkComplete.classList.remove("hidden");
        btnMarkComplete.onclick = () => {
            completeActiveDay();
            modal.classList.remove("active");
        };
    } else {
        btnMarkComplete.classList.add("hidden");
    }

    modal.classList.add("active");
    
    // Trigger LaTeX typesetting
    setTimeout(triggerMathTypesetting, 100);
}

// ==========================================================================
// 14. SPEED DRILLS ("MAKE IT FAST"), FLASHCARDS & COMPUTER QUIZ ENGINES
// ==========================================================================

const FLASHCARDS = [
    { word: "Pernicious", def: "Having a harmful effect, especially in a gradual or subtle way.", ex: "\"The pernicious influence of negative company.\"" },
    { word: "Supercilious", def: "Behaving or looking as though one thinks one is superior to others.", ex: "\"A supercilious lady who looked down on servants.\"" },
    { word: "Ephemeral", def: "Lasting for a very short time; transient.", ex: "\"Fame is ephemeral, but knowledge stays.\"" },
    { word: "Alacrity", def: "Brisk and cheerful readiness.", ex: "\"She accepted the study challenge with alacrity.\"" },
    { word: "Cacophony", def: "A harsh, discordant mixture of sounds.", ex: "\"The cacophony of the busy marketplace.\"" },
    { word: "Benevolent", def: "Well-meaning and kindly.", ex: "\"A benevolent teacher who helped poor children.\"" },
    { word: "Burn the midnight oil", def: "To study or work late into the night.", ex: "\"He is burning the midnight oil for the CGL exam.\"" },
    { word: "A feather in one's cap", def: "An achievement to be proud of.", ex: "\"Clearing CGL with Rank 1 will be a feather in his cap.\"" },
    { word: "By leaps and bounds", def: "Very rapidly; making quick progress.", ex: "\"His speed has improved by leaps and bounds.\"" },
    { word: "Spick and span", def: "Neat, clean, and well-organized.", ex: "\"The study desk was kept spick and span.\"" },
    { word: "Loquacious", def: "Tending to talk a great deal; extremely talkative.", ex: "\"A loquacious candidate lost time in interviews.\"" },
    { word: "Pragmatic", def: "Dealing with things sensibly and realistically based on practical experiences.", ex: "\"A pragmatic study plan is better than a fantasy one.\"" },
    { word: "Red Herring", def: "Something, especially a clue, that is or is intended to be misleading.", ex: "\"The mock question had a red herring option.\"" },
    { word: "At one's beck and call", def: "Always ready to obey someone's orders immediately.", ex: "\"You must not be at anyone's beck and call during study hours.\"" },
    { word: "Frugal", def: "Sparing or economical with regard to money or food; simple.", ex: "\"Living a frugal life to save time and resources.\"" }
];

const ENGLISH_QUESTIONS = [
    { q: "Synonym of 'ABATE':", o: ["Diminish", "Increase", "Prolong", "Intensify"], a: 0 },
    { q: "Antonym of 'ALACRITY':", o: ["Enthusiasm", "Apathy", "Swiftness", "Zeal"], a: 1 },
    { q: "Find the correctly spelled word:", o: ["Committee", "Comitee", "Committe", "Comitte"], a: 0 },
    { q: "One Word Substitution: 'One who hates mankind'", o: ["Philanthropist", "Misogynist", "Misanthrope", "Egotist"], a: 2 },
    { q: "Idiom Meaning: 'To spill the beans'", o: ["To cook beans", "To reveal a secret", "To waste money", "To cause an accident"], a: 1 },
    { q: "Synonym of 'FUTILE':", o: ["Fruitful", "Useless", "Productive", "Important"], a: 1 },
    { q: "Antonym of 'HOSTILE':", o: ["Friendly", "Adverse", "Antagonistic", "Unkind"], a: 0 },
    { q: "Identify the part of speech of the underlined word: 'She runs fast.'", o: ["Noun", "Adjective", "Adverb", "Verb"], a: 2 }
];

const REASONING_QUESTIONS = [
    { q: "Complete the series: 3, 7, 15, 31, 63, ?", o: ["127", "95", "128", "125"], a: 0 },
    { q: "If 'MONKEY' is coded as 'XDJMNL', how is 'TIGER' coded?", o: ["SDFHS", "QDFHS", "QDYTR", "SDFTR"], a: 1 },
    { q: "In a family, A is B's brother, C is A's father, D is C's mother. How is B related to D?", o: ["Grandson", "Granddaughter", "Grandchild", "Daughter-in-law"], a: 2 },
    { q: "Select the odd one out: 27, 64, 125, 144", o: ["27", "64", "125", "144"], a: 3 },
{ q: "Find the next term in the series: B2D, E3G, H4J, ?", o: ["K5M", "K6N", "L5M", "K5N"], a: 0, d: "easy" },
    { q: "Pointing to a photograph, a man said: 'I have no brother or sister, but that man's father is my father's son.' Whose photograph was it?", o: ["His own", "His father's", "His son's", "His nephew's"], a: 2, d: "hard" },
    { q: "If '+' means '×', '-' means '÷', '×' means '-' and '÷' means '+', then: 16 + 4 - 8 × 2 ÷ 3 = ?", o: ["12", "9", "6", "11"], a: 1, d: "medium" },
    { q: "A clock shows 4:30. If the minute hand points East, in which direction does the hour hand point?", o: ["North", "North-East", "South-East", "North-West"], a: 1, d: "hard" },
    { q: "If A=1, FAT=27, then FAITH = ?", o: ["44", "42", "40", "41"], a: 0, d: "hard" },
    { q: "Which number replaces the question mark? 12 : 144 :: 13 : ?", o: ["169", "156", "182", "196"], a: 0, d: "medium" }
];

const COMP_QUESTIONS = [
    { q: "Which of the following keyboard shortcut is used to close the active application window in MS Windows OS?", o: ["Alt + F4", "Ctrl + C", "Win + L", "Alt + Tab"], a: 0, d: "easy" },
    { q: "What is the default port number used by HTTPS (Secure Hypertext Protocol)?", o: ["Port 80", "Port 21", "Port 443", "Port 22"], a: 2, d: "easy" },
    { q: "Which keyboard command opens the 'Run' utility dialog box in Windows OS?", o: ["Win + R", "Win + E", "Win + D", "Ctrl + Shift + Esc"], a: 0, d: "easy" },
    { q: "What is the network protocol port number commonly used for sending email messages (SMTP)?", o: ["Port 25", "Port 110", "Port 143", "Port 53"], a: 0, d: "medium" },
    { q: "Which key combination launches the Windows Task Manager directly?", o: ["Ctrl + Alt + Del", "Ctrl + Shift + Esc", "Win + Tab", "Alt + Shift + Enter"], a: 1, d: "medium" },
    { q: "In Microsoft Excel, which cell referencing remains completely fixed when a formula is copy-pasted?", o: ["Relative (A1)", "Absolute ($A$1)", "Mixed ($A1)", "Dynamic (A1:B1)"], a: 1, d: "medium" },
    { q: "Which Excel formula is used to look up a value in the leftmost column of a table and return a value in the same row?", o: ["HLOOKUP", "VLOOKUP", "LOOKUP", "MATCH"], a: 1, d: "medium" },
    { q: "What malware encrypts the user's hard drive files and demands payment to decrypt them?", o: ["Ransomware", "Trojan", "Adware", "Rootkit"], a: 0, d: "hard" },
    { q: "A firewall is primarily used in networking systems to protect against which of the following?", o: ["Virus transmission in flash drives", "Unauthorized incoming/outgoing network access", "Power supply fluctuations", "Physical theft of hard disks"], a: 1, d: "hard" },
    { q: "Which type of malware replicates itself across computer networks without needing to attach to a host file?", o: ["Trojan Horse", "Ransomware", "Worm", "Spyware"], a: 2, d: "hard" }
];

// Calculation Drills & Sectional Challenge States
let drillMode = "squares"; 
let drillAnswerVal = null;
let drillAttempts = 0;
let drillCorrect = 0;
let drillStreak = 0;
let drillTimerInterval = null;
let drillTimerSecs = 15;
let drillIsPlaying = false; 

// Challenge Engine States
let isChallengeActive = false;
let challengeTimeRemaining = 900; 
let challengeTimerInterval = null;
let challengeQuestionIndex = 0; 
let challengeScore = 0;
let challengeActiveTab = "maths"; 
let challengeCorrectAnswerVal = null; 

function initSpeedDrillsPage() {
    // 0. Speed Sub-Tabs selector
    const speedTabs = document.querySelectorAll(".speed-tab-btn");
    const speedPanels = document.querySelectorAll(".speed-tab-content");
    speedTabs.forEach(tab => {
        tab.onclick = () => {
            if (isChallengeActive) {
                speakText("Challenge in progress");
                alert("Conquest run is active! Abort or complete the current 15-minute challenge before switching tabs.");
                return;
            }
            
            speedTabs.forEach(t => t.classList.remove("active-nav-tab"));
            tab.classList.add("active-nav-tab");
            
            const target = tab.getAttribute("data-target");
            speedPanels.forEach(p => p.classList.add("hidden"));
            const targetPanel = document.getElementById(target);
            if (targetPanel) targetPanel.classList.remove("hidden");
            
            if (target !== "speed-tab-maths") {
                drillIsPlaying = false;
                clearInterval(drillTimerInterval);
                const pauseBtn = document.getElementById("btn-drill-pause");
                if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start`;
                const optionsGrid = document.getElementById("drill-options");
                if (optionsGrid) optionsGrid.classList.add("hidden");
            } else {
                resetDrillSession();
            }
        };
    });

    // 0.5 Challenge Controller Start/Abort Trigger
    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.onclick = () => {
            if (isChallengeActive) {
                endChallengeRun(false, true);
            } else {
                startChallengeRun();
            }
        };
    }

    // 1. Math Drills Mode Buttons Initializer (Free Mode)
    const modeBtns = document.querySelectorAll(".drill-mode-btn");
    modeBtns.forEach(btn => {
        btn.onclick = () => {
            if (isChallengeActive) return;
            modeBtns.forEach(b => b.classList.remove("active-nav-tab"));
            btn.classList.add("active-nav-tab");
            drillMode = btn.getAttribute("data-mode");
            resetDrillSession();
        };
    });

    const pauseBtn = document.getElementById("btn-drill-pause");
    if (pauseBtn) {
        pauseBtn.onclick = () => {
            if (isChallengeActive) return; 
            if (drillIsPlaying) {
                drillIsPlaying = false;
                pauseBtn.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start`;
                clearInterval(drillTimerInterval);
                const optionsGrid = document.getElementById("drill-options");
                if (optionsGrid) optionsGrid.classList.add("hidden");
                speakText("Paused");
            } else {
                drillIsPlaying = true;
                pauseBtn.innerHTML = `<i class="fa-solid fa-pause mr-1"></i> Pause`;
                const optionsGrid = document.getElementById("drill-options");
                if (optionsGrid) optionsGrid.classList.remove("hidden");
                generateDrillQuestion();
            }
        };
    }

    // 2. Vocab Flashcards Initializer (Free Mode)
    let currentVocabIndex = 0;
    const updateVocabCardDisplay = () => {
        const item = FLASHCARDS[currentVocabIndex];
        const card = document.getElementById("vocab-card");
        if (card) card.classList.remove("flipped");
        
        setTimeout(() => {
            const frontWord = document.getElementById("vocab-front-word");
            const backDef = document.getElementById("vocab-back-definition");
            const backEx = document.getElementById("vocab-back-example");
            const counter = document.getElementById("vocab-counter");

            if (frontWord) frontWord.innerText = item.word;
            if (backDef) backDef.innerText = item.def;
            if (backEx) backEx.innerText = item.ex;
            if (counter) counter.innerText = `${currentVocabIndex + 1} / ${FLASHCARDS.length}`;
        }, 150);
    };

    const prevVocabBtn = document.getElementById("btn-vocab-prev");
    const nextVocabBtn = document.getElementById("btn-vocab-next");

    if (prevVocabBtn) {
        prevVocabBtn.onclick = () => {
            if (isChallengeActive) return;
            currentVocabIndex = (currentVocabIndex - 1 + FLASHCARDS.length) % FLASHCARDS.length;
            updateVocabCardDisplay();
        };
    }
    if (nextVocabBtn) {
        nextVocabBtn.onclick = () => {
            if (isChallengeActive) return;
            currentVocabIndex = (currentVocabIndex + 1) % FLASHCARDS.length;
            updateVocabCardDisplay();
        };
    }

    // 3. English Quiz Initializer (Free Mode)
    let currentEngQIndex = 0;
    let engAttempts = 0;
    let engCorrect = 0;

    const renderEnglishQuestion = () => {
        if (isChallengeActive) return; 
        const item = ENGLISH_QUESTIONS[currentEngQIndex];
        const qNum = document.getElementById("eng-q-num");
        const qText = document.getElementById("eng-q-text");

        if (qNum) qNum.innerText = currentEngQIndex + 1;
        if (qText) qText.innerText = item.q;

        const optionsContainer = document.getElementById("eng-options");
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = "";

        item.o.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "eng-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentRose bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
            btn.innerText = option;
            btn.onclick = () => {
                engAttempts++;
                const buttons = optionsContainer.querySelectorAll(".eng-opt-btn");
                buttons.forEach((b, bIdx) => {
                    b.disabled = true;
                    if (bIdx === item.a) {
                        b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
                    } else if (bIdx === idx) {
                        b.className = b.className.replace("border-white/5", "border-accentRose bg-accentRose/15 text-accentRose");
                    }
                });

                if (idx === item.a) {
                    engCorrect++;
                    speakText("Correct");
                } else {
                    speakText("Wrong");
                }

                const scoreEl = document.getElementById("eng-quiz-score");
                if (scoreEl) scoreEl.innerText = `Score: ${engCorrect}/${engAttempts}`;

                setTimeout(() => {
                    currentEngQIndex = (currentEngQIndex + 1) % ENGLISH_QUESTIONS.length;
                    renderEnglishQuestion();
                }, 1800);
            };
            optionsContainer.appendChild(btn);
        });
    };

    const resetEngBtn = document.getElementById("btn-eng-reset");
    if (resetEngBtn) {
        resetEngBtn.onclick = () => {
            if (isChallengeActive) return;
            currentEngQIndex = 0;
            engAttempts = 0;
            engCorrect = 0;
            const scoreEl = document.getElementById("eng-quiz-score");
            if (scoreEl) scoreEl.innerText = "Score: 0/0";
            renderEnglishQuestion();
        };
    }

    // 4. Reasoning Quiz Initializer (Free Mode)
    let currentReasQIndex = 0;
    let reasAttempts = 0;
    let reasCorrect = 0;

    const renderReasoningQuestion = () => {
        if (isChallengeActive) return; 
        const item = REASONING_QUESTIONS[currentReasQIndex];
        const qNum = document.getElementById("reas-q-num");
        const qText = document.getElementById("reas-q-text");

        if (qNum) qNum.innerText = currentReasQIndex + 1;
        if (qText) qText.innerText = item.q;

        const optionsContainer = document.getElementById("reas-options");
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = "";

        item.o.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "reas-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentPurple bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
            btn.innerText = option;
            btn.onclick = () => {
                reasAttempts++;
                const buttons = optionsContainer.querySelectorAll(".reas-opt-btn");
                buttons.forEach((b, bIdx) => {
                    b.disabled = true;
                    if (bIdx === item.a) {
                        b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
                    } else if (bIdx === idx) {
                        b.className = b.className.replace("border-white/5", "border-accentPurple bg-accentPurple/15 text-accentPurple");
                    }
                });

                if (idx === item.a) {
                    reasCorrect++;
                    speakText("Correct");
                } else {
                    speakText("Incorrect");
                }

                const scoreEl = document.getElementById("reas-quiz-score");
                if (scoreEl) scoreEl.innerText = `Score: ${reasCorrect}/${reasAttempts}`;

                setTimeout(() => {
                    currentReasQIndex = (currentReasQIndex + 1) % REASONING_QUESTIONS.length;
                    renderReasoningQuestion();
                }, 1800);
            };
            optionsContainer.appendChild(btn);
        });
    };

    const resetReasBtn = document.getElementById("btn-reas-reset");
    if (resetReasBtn) {
        resetReasBtn.onclick = () => {
            if (isChallengeActive) return;
            currentReasQIndex = 0;
            reasAttempts = 0;
            reasCorrect = 0;
            const scoreEl = document.getElementById("reas-quiz-score");
            if (scoreEl) scoreEl.innerText = "Score: 0/0";
            renderReasoningQuestion();
        };
    }

    // 5. Computer Quiz Initializer (Free Mode)
    let currentCompQIndex = 0;
    let compAttempts = 0;
    let compCorrect = 0;

    const renderComputerQuestion = () => {
        if (isChallengeActive) return; 
        const item = COMP_QUESTIONS[currentCompQIndex];
        const qNum = document.getElementById("comp-q-num");
        const qText = document.getElementById("comp-q-text");

        if (qNum) qNum.innerText = currentCompQIndex + 1;
        if (qText) qText.innerText = item.q;

        const optionsContainer = document.getElementById("comp-options");
        if (!optionsContainer) return;
        
        optionsContainer.innerHTML = "";

        item.o.forEach((option, idx) => {
            const btn = document.createElement("button");
            btn.className = "comp-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentAmber bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
            btn.innerText = option;
            btn.onclick = () => {
                compAttempts++;
                const buttons = optionsContainer.querySelectorAll(".comp-opt-btn");
                buttons.forEach((b, bIdx) => {
                    b.disabled = true;
                    if (bIdx === item.a) {
                        b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
                    } else if (bIdx === idx) {
                        b.className = b.className.replace("border-white/5", "border-accentAmber bg-accentAmber/15 text-accentAmber");
                    }
                });

                if (idx === item.a) {
                    compCorrect++;
                    speakText("Correct answer");
                } else {
                    speakText("Incorrect answer");
                }

                const scoreEl = document.getElementById("comp-quiz-score");
                if (scoreEl) scoreEl.innerText = `Score: ${compCorrect}/${compAttempts}`;

                setTimeout(() => {
                    currentCompQIndex = (currentCompQIndex + 1) % COMP_QUESTIONS.length;
                    renderComputerQuestion();
                }, 1800);
            };
            optionsContainer.appendChild(btn);
        });
    };

    const resetCompBtn = document.getElementById("btn-comp-reset");
    if (resetCompBtn) {
        resetCompBtn.onclick = () => {
            if (isChallengeActive) return;
            currentCompQIndex = 0;
            compAttempts = 0;
            compCorrect = 0;
            const scoreEl = document.getElementById("comp-quiz-score");
            if (scoreEl) scoreEl.innerText = "Score: 0/0";
            renderComputerQuestion();
        };
    }

    // Load initial states
    resetDrillSession();
    updateVocabCardDisplay();
    renderEnglishQuestion();
    renderReasoningQuestion();
    renderComputerQuestion();
}

function flipVocabCard() {
    const card = document.getElementById("vocab-card");
    if (card) card.classList.toggle("flipped");
}

function generateMathOptions(correct) {
    const options = new Set([correct]);
    while (options.size < 4) {
        const offsets = [-3, -2, -1, 1, 2, 3, -10, 10, -5, 5, -20, 20];
        const offset = offsets[Math.floor(Math.random() * offsets.length)];
        const distractor = correct + offset;
        if (distractor > 0 && distractor !== correct) {
            options.add(distractor);
        }
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
}

function generateDrillQuestion() {
    const qLabel = document.getElementById("drill-question-label");
    if (!qLabel) return;

    if (!drillIsPlaying) {
        qLabel.innerText = "Select a mode & press Start";
        const optionsGrid = document.getElementById("drill-options");
        if (optionsGrid) optionsGrid.classList.add("hidden");
        return;
    }

    let questionText = "";
    let answer = 0;

    if (drillMode === "squares") {
        const num = Math.floor(Math.random() * 30) + 1; 
        questionText = `${num}² = ?`;
        answer = num * num;
    } else if (drillMode === "cubes") {
        const num = Math.floor(Math.random() * 20) + 1; 
        questionText = `${num}³ = ?`;
        answer = num * num * num;
    } else if (drillMode === "tables") {
        const n1 = Math.floor(Math.random() * 39) + 2; 
        const n2 = Math.floor(Math.random() * 10) + 1; 
        questionText = `${n1} × ${n2} = ?`;
        answer = n1 * n2;
    } else if (drillMode === "fractions") {
        const fracList = [
            { f: "1/2", a: 50 }, { f: "1/3", a: 33 }, { f: "1/4", a: 25 },
            { f: "1/5", a: 20 }, { f: "1/6", a: 16 }, { f: "1/7", a: 14 },
            { f: "1/8", a: 12 }, { f: "1/9", a: 11 }, { f: "1/10", a: 10 },
            { f: "1/11", a: 9 }, { f: "1/12", a: 8 }, { f: "1/15", a: 6 },
            { f: "1/16", a: 6 }, { f: "3/8", a: 37 }, { f: "5/8", a: 62 }
        ];
        const item = fracList[Math.floor(Math.random() * fracList.length)];
        questionText = `${item.f} as % (approx) = ?`;
        answer = item.a;
    } else if (drillMode === "triplets") {
        const baseTriplets = [
            [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25],
            [9, 40, 41], [11, 60, 61], [12, 35, 37], [20, 21, 29]
        ];
        const base = baseTriplets[Math.floor(Math.random() * baseTriplets.length)];
        const mult = Math.floor(Math.random() * 3) + 1; 
        const trip = base.map(val => val * mult);

        const blankIdx = Math.floor(Math.random() * 3);
        answer = trip[blankIdx];

        const displayArr = trip.map((val, idx) => idx === blankIdx ? "?" : val);
        questionText = `Triplet: ${displayArr.join(", ")}`;
    } else if (drillMode === "algebra") {
        const a = Math.floor(Math.random() * 6) + 3; 
        const b = Math.floor(Math.random() * 2) + 1; 
        const type = Math.floor(Math.random() * 6); 

        if (type === 0) {
            questionText = `If a = ${a}, b = ${b}, find value of a + b`;
            answer = a + b;
        } else if (type === 1) {
            questionText = `If a = ${a}, b = ${b}, find value of a - b`;
            answer = a - b;
        } else if (type === 2) {
            questionText = `If a = ${a}, b = ${b}, find value of ab`;
            answer = a * b;
        } else if (type === 3) {
            questionText = `If a = ${a}, b = ${b}, find value of a² - b²`;
            answer = (a * a) - (b * b);
        } else if (type === 4) {
            questionText = `If a = ${a}, b = ${b}, find value of a² + b²`;
            answer = (a * a) + (b * b);
        } else if (drillMode === "lcm") {
            const list = [
                { n: [2, 3, 4], a: 12 }, { n: [3, 4, 6], a: 12 }, { n: [4, 6, 8], a: 24 },
                { n: [6, 8, 12], a: 24 }, { n: [5, 10, 15], a: 30 }, { n: [6, 9, 12], a: 36 },
                { n: [8, 12, 16], a: 48 }, { n: [10, 12, 15], a: 60 }, { n: [12, 15, 20], a: 60 },
                { n: [8, 12, 15], a: 120 }, { n: [12, 16, 24], a: 48 }, { n: [15, 20, 30], a: 60 },
                { n: [9, 12, 18], a: 36 }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const shuffled = [...item.n].sort(() => Math.random() - 0.5);
            questionText = `LCM of (${shuffled.join(", ")}) = ?`;
            answer = item.a;
        } else if (drillMode === "hcf") {
            const f = Math.floor(Math.random() * 12) + 2; // HCF factor 2 to 14
            const multipliers = [
                [2, 3, 5], [2, 5, 7], [3, 4, 5], [3, 5, 7], [2, 3, 7], [4, 5, 7]
            ];
            const mults = multipliers[Math.floor(Math.random() * multipliers.length)];
            questionText = `HCF of (${f * mults[0]}, ${f * mults[1]}, ${f * mults[2]}) = ?`;
            answer = f;
        } else {
            questionText = `If a = ${a}, b = ${b}, find value of (a-b)²`;
            answer = (a - b) * (a - b);
        }
    }

    qLabel.innerText = questionText;
    drillAnswerVal = answer;

    const optionsGrid = document.getElementById("drill-options");
    if (optionsGrid) {
        optionsGrid.innerHTML = "";
        optionsGrid.classList.remove("hidden");
        
        const choices = generateMathOptions(answer);
        choices.forEach(val => {
            const btn = document.createElement("button");
            btn.className = "math-opt-btn p-3 rounded-xl border border-white/5 bg-white/2px hover:bg-cyan-500/10 hover:border-accentCyan transition text-sm font-bold text-gray-200";
            btn.innerText = val;
            btn.onclick = () => checkDrillAnswer(val);
            optionsGrid.appendChild(btn);
        });
    }

    clearInterval(drillTimerInterval);
    drillTimerSecs = 15;
    const fill = document.getElementById("drill-timer-fill");
    if (fill) fill.style.width = "100%";

    drillTimerInterval = setInterval(() => {
        drillTimerSecs--;
        if (fill) fill.style.width = `${(drillTimerSecs / 15) * 100}%`;

        if (drillTimerSecs <= 0) {
            clearInterval(drillTimerInterval);
            drillAttempts++;
            drillStreak = 0;
            
            const feedback = document.getElementById("drill-feedback");
            const scoreEl = document.getElementById("drill-score");

            if (feedback) {
                feedback.innerText = "Timeout! Answer was " + drillAnswerVal + " ❌";
                feedback.className = "text-xs font-semibold text-accentRose";
            }
            if (scoreEl) scoreEl.innerText = `Score: ${drillCorrect}/${drillAttempts}`;
            
            const buttons = document.querySelectorAll(".math-opt-btn");
            buttons.forEach(b => {
                b.disabled = true;
                if (parseInt(b.innerText) === drillAnswerVal) {
                    b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
                }
            });

            speakText("Time out");
            setTimeout(generateDrillQuestion, 1500);
        }
    }, 1000);
}

function checkDrillAnswer(chosenVal) {
    clearInterval(drillTimerInterval);
    drillAttempts++;

    const feedback = document.getElementById("drill-feedback");
    const scoreEl = document.getElementById("drill-score");
    const buttons = document.querySelectorAll(".math-opt-btn");

    buttons.forEach(b => {
        b.disabled = true;
        const val = parseInt(b.innerText);
        if (val === drillAnswerVal) {
            b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
        } else if (val === chosenVal) {
            b.className = b.className.replace("border-white/5", "border-accentRose bg-accentRose/15 text-accentRose");
        }
    });

    if (chosenVal === drillAnswerVal) {
        drillCorrect++;
        drillStreak++;
        if (feedback) {
            feedback.innerText = `Correct! Streak: ${drillStreak} 🔥`;
            feedback.className = "text-xs font-semibold text-accentGreen animate-bounce";
        }
        speakText("Correct");
    } else {
        drillStreak = 0;
        if (feedback) {
            feedback.innerText = `Incorrect! Answer was ${drillAnswerVal} ❌`;
            feedback.className = "text-xs font-semibold text-accentRose";
        }
        speakText("Wrong answer");
    }

    if (scoreEl) scoreEl.innerText = `Score: ${drillCorrect}/${drillAttempts}`;
    setTimeout(generateDrillQuestion, 1500);
}

function resetDrillSession() {
    clearInterval(drillTimerInterval);
    drillAttempts = 0;
    drillCorrect = 0;
    drillStreak = 0;
    drillIsPlaying = false; 
    
    const scoreEl = document.getElementById("drill-score");
    const feedback = document.getElementById("drill-feedback");
    const pauseBtn = document.getElementById("btn-drill-pause");
    const qLabel = document.getElementById("drill-question-label");
    const fill = document.getElementById("drill-timer-fill");
    const optionsGrid = document.getElementById("drill-options");

    if (scoreEl) scoreEl.innerText = "Score: 0/0";
    if (feedback) {
        feedback.innerText = "Streak: 0 🔥";
        feedback.className = "text-xs font-semibold text-gray-400";
    }
    if (pauseBtn) pauseBtn.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start`;
    if (qLabel) qLabel.innerText = "Select a mode & press Start";
    if (fill) fill.style.width = "100%";
    if (optionsGrid) {
        optionsGrid.innerHTML = "";
        optionsGrid.classList.add("hidden");
    }
}

// ==========================================================================
// 15. SECTIONAL TIMER CHALLENGE CONTROLLERS (15 MINS, 25 PROGRESSIVE Qs)
// ==========================================================================

function startChallengeRun() {
    isChallengeActive = true;
    challengeTimeRemaining = 900; // 15 mins
    challengeQuestionIndex = 0;
    challengeScore = 0;
    
    const activeTabBtn = document.querySelector(".speed-tab-btn.active-nav-tab");
    challengeActiveTab = activeTabBtn ? activeTabBtn.getAttribute("data-target").replace("speed-tab-", "") : "maths";
    
    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.innerHTML = `<i class="fa-solid fa-square mr-1"></i> Abort Run`;
        btnChallengeStart.className = "bg-accentRose hover:bg-rose-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition duration-200 ml-2 animate-pulse";
    }

    toggleFreeModeComponents(false);
    updateChallengeUI();

    clearInterval(challengeTimerInterval);
    challengeTimerInterval = setInterval(() => {
        challengeTimeRemaining--;
        updateChallengeUI();
        if (challengeTimeRemaining <= 0) {
            endChallengeRun(false); 
        }
    }, 1000);

    speakText("Challenge started");
    generateChallengeQuestion();
}

function updateChallengeUI() {
    const min = Math.floor(challengeTimeRemaining / 60);
    const sec = challengeTimeRemaining % 60;
    const formattedTime = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    
    const timerEl = document.getElementById("challenge-timer");
    const progressEl = document.getElementById("challenge-progress");
    const diffEl = document.getElementById("challenge-diff");

    if (timerEl) timerEl.innerText = formattedTime;
    if (progressEl) progressEl.innerText = `${challengeQuestionIndex + 1} / 25`;
    
    let level = "Easy";
    let colorClass = "text-accentGreen";
    if (challengeQuestionIndex >= 15) {
        level = "Hard";
        colorClass = "text-accentRose";
    } else if (challengeQuestionIndex >= 5) {
        level = "Medium";
        colorClass = "text-accentAmber";
    }
    
    if (diffEl) {
        diffEl.innerText = level;
        diffEl.className = `font-bold text-xs uppercase ${colorClass}`;
    }
}

function getChallengeQuestion(subject, difficulty) {
    let pool = [];
    if (subject === "english") pool = ENGLISH_QUESTIONS;
    else if (subject === "reasoning") pool = REASONING_QUESTIONS;
    else if (subject === "computer") pool = COMP_QUESTIONS;
    
    const filtered = pool.filter(q => q.d === difficulty);
    if (filtered.length === 0) return pool[Math.floor(Math.random() * pool.length)];
    return filtered[Math.floor(Math.random() * filtered.length)];
}

function generateProceduralMathQuestion(difficulty) {
    let questionText = "";
    let answer = 0;
    const modes = ["squares", "cubes", "tables", "fractions", "triplets", "algebra", "lcm", "hcf"];
    const mode = modes[Math.floor(Math.random() * modes.length)];
    
    if (difficulty === "easy") {
        if (mode === "squares") {
            const num = Math.floor(Math.random() * 12) + 1; 
            questionText = `${num}² = ?`;
            answer = num * num;
        } else if (mode === "cubes") {
            const num = Math.floor(Math.random() * 5) + 1; 
            questionText = `${num}³ = ?`;
            answer = num * num * num;
        } else if (mode === "tables") {
            const n1 = Math.floor(Math.random() * 9) + 2; 
            const n2 = Math.floor(Math.random() * 10) + 1; 
            questionText = `${n1} × ${n2} = ?`;
            answer = n1 * n2;
        } else if (mode === "fractions") {
            const list = [{ f: "1/2", a: 50 }, { f: "1/3", a: 33 }, { f: "1/4", a: 25 }, { f: "1/5", a: 20 }];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `${item.f} as % (approx) = ?`;
            answer = item.a;
        } else if (mode === "triplets") {
            const base = [[3, 4, 5], [5, 12, 13]];
            const trip = base[Math.floor(Math.random() * base.length)];
            const blankIdx = Math.floor(Math.random() * 3);
            answer = trip[blankIdx];
            const display = trip.map((val, idx) => idx === blankIdx ? "?" : val);
            questionText = `Triplet: ${display.join(", ")}`;
        } else if (mode === "lcm") {
            const list = [
                { n: [2, 3, 4], a: 12 }, { n: [3, 4, 6], a: 12 }, { n: [2, 5, 10], a: 10 },
                { n: [3, 5, 15], a: 15 }, { n: [4, 5, 10], a: 20 }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const shuffled = [...item.n].sort(() => Math.random() - 0.5);
            questionText = `LCM of (${shuffled.join(", ")}) = ?`;
            answer = item.a;
        } else if (mode === "hcf") {
            const f = Math.floor(Math.random() * 3) + 2; // HCF factor 2, 3, 4
            const multipliers = [[2, 3, 5], [3, 4, 5], [2, 5, 7]];
            const mults = multipliers[Math.floor(Math.random() * multipliers.length)];
            questionText = `HCF of (${f * mults[0]}, ${f * mults[1]}, ${f * mults[2]}) = ?`;
            answer = f;
        } else {
            const a = Math.floor(Math.random() * 4) + 2; 
            const b = Math.floor(Math.random() * 2) + 1; 
            const type = Math.floor(Math.random() * 3);
            if (type === 0) {
                questionText = `If a = ${a}, b = ${b}, find a + b`;
                answer = a + b;
            } else if (type === 1) {
                questionText = `If a = ${a}, b = ${b}, find a - b`;
                answer = a - b;
            } else {
                questionText = `If a = ${a}, b = ${b}, find ab`;
                answer = a * b;
            }
        }
    } else if (difficulty === "medium") {
        if (mode === "squares") {
            const num = Math.floor(Math.random() * 10) + 13; 
            questionText = `${num}² = ?`;
            answer = num * num;
        } else if (mode === "cubes") {
            const num = Math.floor(Math.random() * 7) + 6; 
            questionText = `${num}³ = ?`;
            answer = num * num * num;
        } else if (mode === "tables") {
            const n1 = Math.floor(Math.random() * 10) + 11; 
            const n2 = Math.floor(Math.random() * 10) + 1; 
            questionText = `${n1} × ${n2} = ?`;
            answer = n1 * n2;
        } else if (mode === "fractions") {
            const list = [{ f: "1/6", a: 16 }, { f: "1/8", a: 12 }, { f: "1/10", a: 10 }];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `${item.f} as % (approx) = ?`;
            answer = item.a;
        } else if (mode === "triplets") {
            const base = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [20, 21, 29]];
            const selected = base[Math.floor(Math.random() * base.length)];
            const trip = selected.map(val => val * 2); 
            const blankIdx = Math.floor(Math.random() * 3);
            answer = trip[blankIdx];
            const display = trip.map((val, idx) => idx === blankIdx ? "?" : val);
            questionText = `Triplet: ${display.join(", ")}`;
        } else if (mode === "lcm") {
            const list = [
                { n: [4, 6, 8], a: 24 }, { n: [6, 8, 12], a: 24 }, { n: [5, 10, 15], a: 30 },
                { n: [6, 9, 12], a: 36 }, { n: [8, 12, 16], a: 48 }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const shuffled = [...item.n].sort(() => Math.random() - 0.5);
            questionText = `LCM of (${shuffled.join(", ")}) = ?`;
            answer = item.a;
        } else if (mode === "hcf") {
            const f = Math.floor(Math.random() * 4) + 5; // HCF factor 5, 6, 7, 8
            const multipliers = [[2, 3, 5], [3, 4, 5], [2, 5, 7]];
            const mults = multipliers[Math.floor(Math.random() * multipliers.length)];
            questionText = `HCF of (${f * mults[0]}, ${f * mults[1]}, ${f * mults[2]}) = ?`;
            answer = f;
        } else {
            const a = Math.floor(Math.random() * 5) + 5; 
            const b = Math.floor(Math.random() * 3) + 2; 
            const type = Math.floor(Math.random() * 3);
            if (type === 0) {
                questionText = `If a = ${a}, b = ${b}, find a² - b²`;
                answer = (a * a) - (b * b);
            } else if (type === 1) {
                questionText = `If a = ${a}, b = ${b}, find a² + b²`;
                answer = (a * a) + (b * b);
            } else {
                questionText = `If a = ${a}, b = ${b}, find (a-b)²`;
                answer = (a - b) * (a - b);
            }
        }
    } else {
        if (mode === "squares") {
            const num = Math.floor(Math.random() * 8) + 23; 
            questionText = `${num}² = ?`;
            answer = num * num;
        } else if (mode === "cubes") {
            const num = Math.floor(Math.random() * 7) + 13; 
            questionText = `${num}³ = ?`;
            answer = num * num * num;
        } else if (mode === "tables") {
            const n1 = Math.floor(Math.random() * 15) + 26; 
            const n2 = Math.floor(Math.random() * 10) + 1; 
            questionText = `${n1} × ${n2} = ?`;
            answer = n1 * n2;
        } else if (mode === "fractions") {
            const list = [
                { f: "1/7", a: 14 }, { f: "1/9", a: 11 }, { f: "1/11", a: 9 },
                { f: "1/12", a: 8 }, { f: "1/15", a: 6 }, { f: "1/16", a: 6 },
                { f: "3/8", a: 37 }, { f: "5/8", a: 62 }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            questionText = `${item.f} as % (approx) = ?`;
            answer = item.a;
        } else if (mode === "triplets") {
            const base = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
            const selected = base[Math.floor(Math.random() * base.length)];
            const trip = selected.map(val => val * 3); 
            const blankIdx = Math.floor(Math.random() * 3);
            answer = trip[blankIdx];
            const display = trip.map((val, idx) => idx === blankIdx ? "?" : val);
            questionText = `Triplet: ${display.join(", ")}`;
        } else if (mode === "lcm") {
            const list = [
                { n: [8, 12, 15], a: 120 }, { n: [12, 15, 20], a: 60 }, { n: [10, 12, 15], a: 60 },
                { n: [12, 16, 24], a: 48 }, { n: [9, 12, 18], a: 36 }
            ];
            const item = list[Math.floor(Math.random() * list.length)];
            const shuffled = [...item.n].sort(() => Math.random() - 0.5);
            questionText = `LCM of (${shuffled.join(", ")}) = ?`;
            answer = item.a;
        } else if (mode === "hcf") {
            const f = Math.floor(Math.random() * 6) + 10; // HCF factor 10 to 15
            const multipliers = [[2, 3, 5], [3, 4, 5], [2, 5, 7], [2, 3, 7]];
            const mults = multipliers[Math.floor(Math.random() * multipliers.length)];
            questionText = `HCF of (${f * mults[0]}, ${f * mults[1]}, ${f * mults[2]}) = ?`;
            answer = f;
        } else {
            const finalA = Math.floor(Math.random() * 6) + 4; 
            const finalB = Math.floor(Math.random() * 3) + 1; 
            const type = Math.floor(Math.random() * 2);
            if (type === 0) {
                const sum = finalA + finalB;
                const prod = finalA * finalB;
                questionText = `If a+b = ${sum}, ab = ${prod}, find a² + b²`;
                answer = (finalA * finalA) + (finalB * finalB);
            } else {
                const diff = finalA - finalB;
                const prod = finalA * finalB;
                questionText = `If a-b = ${diff}, ab = ${prod}, find a² + b²`;
                answer = (finalA * finalA) + (finalB * finalB);
            }
        }
    }
    
    const choices = generateMathOptions(answer);
    return { q: questionText, a: answer, o: choices };
}

function generateChallengeQuestion() {
    updateChallengeUI();

    let diff = "easy";
    if (challengeQuestionIndex >= 15) {
        diff = "hard";
    } else if (challengeQuestionIndex >= 5) {
        diff = "medium";
    }

    if (challengeActiveTab === "maths") {
        const qLabel = document.getElementById("drill-question-label");
        const optionsGrid = document.getElementById("drill-options");
        if (qLabel && optionsGrid) {
            optionsGrid.innerHTML = "";
            optionsGrid.classList.remove("hidden");
            
            const qData = generateProceduralMathQuestion(diff);
            qLabel.innerText = qData.q;
            challengeCorrectAnswerVal = qData.a;
            
            qData.o.forEach(choice => {
                const btn = document.createElement("button");
                btn.className = "math-opt-btn p-3 rounded-xl border border-white/5 bg-white/2px hover:bg-cyan-500/10 hover:border-accentCyan transition text-sm font-bold text-gray-200";
                btn.innerText = choice;
                btn.onclick = () => submitChallengeAnswer("maths", choice, qData.a, optionsGrid.querySelectorAll(".math-opt-btn"));
                optionsGrid.appendChild(btn);
            });
        }
    } else if (challengeActiveTab === "english") {
        const qText = document.getElementById("eng-q-text");
        const optionsGrid = document.getElementById("eng-options");
        if (qText && optionsGrid) {
            optionsGrid.innerHTML = "";
            const qData = getChallengeQuestion("english", diff);
            qText.innerText = qData.q;
            challengeCorrectAnswerVal = qData.a;
            
            qData.o.forEach((choice, idx) => {
                const btn = document.createElement("button");
                btn.className = "eng-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentRose bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
                btn.innerText = choice;
                btn.onclick = () => submitChallengeAnswer("english", idx, qData.a, optionsGrid.querySelectorAll(".eng-opt-btn"));
                optionsGrid.appendChild(btn);
            });
        }
    } else if (challengeActiveTab === "reasoning") {
        const qText = document.getElementById("reas-q-text");
        const optionsGrid = document.getElementById("reas-options");
        if (qText && optionsGrid) {
            optionsGrid.innerHTML = "";
            const qData = getChallengeQuestion("reasoning", diff);
            qText.innerText = qData.q;
            challengeCorrectAnswerVal = qData.a;
            
            qData.o.forEach((choice, idx) => {
                const btn = document.createElement("button");
                btn.className = "reas-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentPurple bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
                btn.innerText = choice;
                btn.onclick = () => submitChallengeAnswer("reasoning", idx, qData.a, optionsGrid.querySelectorAll(".reas-opt-btn"));
                optionsGrid.appendChild(btn);
            });
        }
    } else if (challengeActiveTab === "computer") {
        const qText = document.getElementById("comp-q-text");
        const optionsGrid = document.getElementById("comp-options");
        if (qText && optionsGrid) {
            optionsGrid.innerHTML = "";
            const qData = getChallengeQuestion("computer", diff);
            qText.innerText = qData.q;
            challengeCorrectAnswerVal = qData.a;
            
            qData.o.forEach((choice, idx) => {
                const btn = document.createElement("button");
                btn.className = "comp-opt-btn w-full text-left p-3 rounded-xl border border-white/5 hover:border-accentAmber bg-white/2px hover:bg-white/5 transition text-xs font-semibold text-gray-300";
                btn.innerText = choice;
                btn.onclick = () => submitChallengeAnswer("computer", idx, qData.a, optionsGrid.querySelectorAll(".comp-opt-btn"));
                optionsGrid.appendChild(btn);
            });
        }
    }
}

function submitChallengeAnswer(subject, chosenValOrIndex, correctValOrIndex, optButtons) {
    let isCorrect = (chosenValOrIndex === correctValOrIndex);
    
    optButtons.forEach((b, bIdx) => {
        b.disabled = true;
        if (subject === "maths") {
            const val = parseInt(b.innerText);
            if (val === correctValOrIndex) {
                b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
            } else if (val === chosenValOrIndex) {
                b.className = b.className.replace("border-white/5", "border-accentRose bg-accentRose/15 text-accentRose");
            }
        } else {
            const activeColorClass = (subject === "english" ? "border-accentRose bg-accentRose/15 text-accentRose" :
                                      subject === "reasoning" ? "border-accentPurple bg-accentPurple/15 text-accentPurple" :
                                      "border-accentAmber bg-accentAmber/15 text-accentAmber");
            if (bIdx === correctValOrIndex) {
                b.className = b.className.replace("border-white/5", "border-accentGreen bg-accentGreen/15 text-accentGreen");
            } else if (bIdx === chosenValOrIndex) {
                b.className = b.className.replace("border-white/5", activeColorClass);
            }
        }
    });

    if (isCorrect) {
        challengeScore++;
        speakText("Correct");
    } else {
        speakText("Wrong");
    }

    setTimeout(() => {
        if (challengeQuestionIndex >= 24) {
            endChallengeRun(true);
        } else {
            challengeQuestionIndex++;
            generateChallengeQuestion();
        }
    }, 1500);
}

function endChallengeRun(completed = false, aborted = false) {
    isChallengeActive = false;
    clearInterval(challengeTimerInterval);

    const btnChallengeStart = document.getElementById("btn-challenge-start");
    if (btnChallengeStart) {
        btnChallengeStart.innerHTML = `<i class="fa-solid fa-play mr-1"></i> Start Challenge`;
        btnChallengeStart.className = "bg-accentCyan hover:bg-cyan-500 text-white font-extrabold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition duration-200 ml-2";
    }

    const timerEl = document.getElementById("challenge-timer");
    const progressEl = document.getElementById("challenge-progress");
    if (timerEl) timerEl.innerText = "15:00";
    if (progressEl) progressEl.innerText = "0 / 25";

    toggleFreeModeComponents(true);

    if (aborted) {
        speakText("Challenge aborted");
        alert("Challenge Run was aborted.");
    } else if (completed) {
        const timeTaken = 900 - challengeTimeRemaining;
        const pass = (challengeScore >= 20); 
        
        if (pass) {
            speakText("Conquest cleared");
            alert(`🔥 CONQUEST RUN CLEARED!\nSubject: ${challengeActiveTab.toUpperCase()}\nScore: ${challengeScore} / 25 correct!\nTime taken: ${timeTaken} seconds.\nRating: Super Human reflexes unlocked!`);
        } else {
            speakText("Cutoff not cleared");
            alert(`❌ CHALLENGE FINISHED\nSubject: ${challengeActiveTab.toUpperCase()}\nScore: ${challengeScore} / 25 correct.\nTime taken: ${timeTaken} seconds.\nYou need at least 20/25 to clear the CGL Tier-2 qualifying cutoff. Keep practicing!`);
        }
    } else {
        speakText("Time out");
        alert(`⏰ TIMEOUT! You ran out of time on question ${challengeQuestionIndex + 1}.\nScore: ${challengeScore} / 25 correct.`);
    }

    const activeTabBtn = document.querySelector(".speed-tab-btn.active-nav-tab");
    const target = activeTabBtn ? activeTabBtn.getAttribute("data-target") : "speed-tab-maths";
    
    if (target === "speed-tab-maths") {
        resetDrillSession();
    } else if (target === "speed-tab-english") {
        renderEnglishQuestion();
    } else if (target === "speed-tab-reasoning") {
        renderReasoningQuestion();
    } else if (target === "speed-tab-computer") {
        renderComputerQuestion();
    }
}

function toggleFreeModeComponents(show) {
    const modeSelectors = document.querySelector(".grid.grid-cols-2.sm\\:grid-cols-3.gap-2.mb-6");
    if (modeSelectors) {
        if (show) modeSelectors.classList.remove("hidden");
        else modeSelectors.classList.add("hidden");
    }

    const startPauseBtn = document.getElementById("btn-drill-pause");
    if (startPauseBtn) {
        if (show) startPauseBtn.classList.remove("hidden");
        else startPauseBtn.classList.add("hidden");
    }

    const flashcardsBlock = document.querySelector("#speed-tab-english > div:first-child");
    if (flashcardsBlock) {
        if (show) flashcardsBlock.classList.remove("hidden");
        else flashcardsBlock.classList.add("hidden");
    }

    const btnEngReset = document.getElementById("btn-eng-reset");
    const btnReasReset = document.getElementById("btn-reas-reset");
    const btnCompReset = document.getElementById("btn-comp-reset");
    
    if (btnEngReset) btnEngReset.style.display = show ? "flex" : "none";
    if (btnReasReset) btnReasReset.style.display = show ? "flex" : "none";
    if (btnCompReset) btnCompReset.style.display = show ? "flex" : "none";
}
