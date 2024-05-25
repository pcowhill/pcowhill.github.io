// Enumeration of dictionary types
export const CATEGORY = 0;
export const SECTION = 1;
export const SUBSECTION = 2;
export const ENTRY = 3;


// Every dictionary must have a type, otherwise and error will (should) occur.
// Every dictionary may have a description which will be used if available.
export const textContents = {
  type: CATEGORY,
  "Education": {
    type: SECTION,
    "Georgia Institue of Technology": {
      type: SUBSECTION,
      description: `
        GPA: 4.00<br>
        Atlanta, GA<br>
        August 2021 - May 2024
      `,
      "Classes": {
        type: ENTRY,
        text: `
          Below are all the courses completed during my gradute studies, all of
          which awarded an 'A' grade.
        `,
        list: [
          "Advanced Digital Signal Processing",
          "Computer Network Security",
          "Graphical Models in Machine Learning",
          "Advanced Computer Architecture",
          "Adaptive Filtering",
          "Fourier Techniques and Signal Analysis",
          "Partial Differential Equations for Image Processing and Computer Vision",
          "Advanced Programming Techniques",
          "Mathematical Foundations of Machine Learning",
          "Foundations and Implementation of Modeling and Simulation"
        ]
      }
    },
    "University of Florida": {
      type: SUBSECTION,
      description: `
        GPA: 4.00<br>
        Gainesville, FL<br>
        August 2016 - December 2019
      `,
      "Honors and Achievements": {
        type: ENTRY,
        text: `
          These honors and achievements were accomplished while enrolled at
          the University of Florida.
        `,
        list: [
          "Awarded the Center for Condensed Matter Sciences (CCMS) Undergraduate Fellowship",
          "Selected for The University of Florida Honors Program",
          "Member of the Phi Beta Kappa Honors Society and Phi Kappa Phi Honors Society"
        ]
      },
      "Classes": {
        type: ENTRY,
        text: `
          Below are a selection of the courses completed during my
          undergraduate studies, all of which awarded an 'A' grade.
        `,
        list: [
          "Laboratory Physics 1 and 2",
          "Physics Modeling and Simulation",
          "Functions of Complex Variables",
          "Programming Using C",
          "Advanced Calculus (Real Analysis) 1 and 2",
          "Electromagnetism 1 and 2",
          "Mechanics 1 and 2",
          "Thermal Physics",
          "Intro to Quantum Mechanics",
          "Intro to Numerical Analysis",
          "Differential Equations for Engineering and Physics",
          "Linear Algebra and Computational Linera Algebra",
          "Sets and Logic",
          "Modern Physics"
        ]
      }
    },
    "Martin County High School": {
      type: SUBSECTION,
      description: `
        Weighted GPA: 5.9<br>
        Stuart, FL<br>
        August 2012 - May 2016
      `,
      "Honors and Achievements": {
        type: ENTRY,
        text: `
          These honors and achievements were accomplished while enrolled at
          Martin County High School.
        `,
        list: [
          "President of Mu Alpha Theta (Math Honors Society)",
          "President of OPUS (Auditioned School Choir)"
        ]
      },
      "AP Classes": {
        type: ENTRY,
        text: `
          Below is a list of the Advanced Placement classes taken in high school
          which converted into college credit upon attending the University of
          Florida.  The name of the AP course is listed and is followed by the
          equivalent college course(s) which were awarded upon admission into
          the University of Florida.
        `,
        list: [
          "AP Physics 1 and 2: Willfully opted out of transfer to enroll in Physics 1 and 2 with lab at the University of Florida",
          "AP Calculus AB/BC: {Analytical Geometry and Calculus 1; Analytical Geometry and Calculus 2}",
          "AP Chemistry: {General Chemistry; General Chemistry Lab; General Chemistry and Quality Analysis; General Chemistry and Quality Analysis Lab}",
          "AP Statistics: {Intro to Statistics 1}",
          "AP US History: {United States to 1877; United States since 1877}",
          "AP World History: {World History}",
          "AP Macroeconomics: {Principles of Macroeconomics}",
          "AP Human Geography: {Intro to Human Geography}",
          "AP Music Theory: {Intro to Music Theory; Theory of Music 1}"
        ]
      },
      "Dual Enrollment": {
        type: ENTRY,
        text: `
          Below is a list of the Dual Enrollment classes taken in high school
          which persisted as college credit upon attending the University of
          Florida.  These courses were taken at Indian River State College
          across campuses in Fort Pierce, FL.
        `,
        list: [
          "Differential Equations",
          "Calculus 3",
          "English Comprehension 1",
          "English Comprehension 2"
        ]
      }
    }
  },
  "Experience": {
    type: SECTION,
    "Work": {
      type: ENTRY,
      list: [
        "We",
        "do",
        "work"
      ]
    }
  }
};