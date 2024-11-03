index (HTML)
  header
    css information
    font information
  body
    Basic contents no js
    js failure disclaimer
    section for dynamic content
    javascript script

InitiativeTracker
  attributes
    currentPage (Page)
    currentModal (Modal)
    cookieHandler (CookieHandler)
    htmlId (string)
    sessionData (SessionData)
  methods
    initialize
      set htmlId
      create main menu page
      read cookies, set data
      updateHTML
    update
      clear
      getHtml from currentPage
      getHtml from currentModal
      update index.html
      refresh page evntLstners
      refresh modal evntLstners
      save cookies
    changePages(newPage)
      initialize currentPage
    addCreature
      add creature to initiativeList
      update
    editCreature
      change creature on initiativeList
      update
    killCreature
      send creature to deadList
      update




MainMenuPage (Page)
  methods
    init
      call super init
      set eventListeners
    getHtml
      Creates HtmlCode

PreEncounterPage(Page)
  methods
    init
      call super init
      set eventListeners
    getHtml(data)
      Creates HtmlCode from data

EncounterPage(Page)
  methods
    init
      call super init
      set eventListeners
    getHtml(data)
      Creates HtmlCode from data

Page
  attributes
    pageType = PageType
    ownerUpdateFunction
    ownerChangePagesFunction
    eventListeners (list)
  methods
    init
      set pageType
      set ownerUpdateFunction
      set ownerChangePagesFunction


Modal
  attributes
    modelType (ModalType)
    ownerUpdateFunction
    isActive
    textPrompt
    eventListeners (list)
  methods
    activate(type, defaultInput)
      set type
      set default input
      set active
      set ownerUpdateFunction
    getHtml
      Creates HtmlCode

CookieHandler
  methods
    saveCookies(data)
      saves data to cookies
    loadCookies()
      returns data from cookies

PageType
  Enumeration
    MainMenu
    PreEncounter
    Encounter

ModalType
  Enumeration
    YesOrNo
    TextInput
    NumberInput

HtmlCode
  attributes
    content (string)
  methods
    constructor
    wrapInDiv
    append
    prepend
    clear
    join

SessionData
  attributes
    initiativeList
    deadList
    currentPage
    encounterName

EventListener
  attributes
    elementId
    eventType
    reaction
  methods
    refresh
      call document.getE...