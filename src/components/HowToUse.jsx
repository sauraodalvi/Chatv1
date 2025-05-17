import {
  ArrowLeft,
  MessageSquare,
  Users,
  Wand2,
  BookOpen,
  Sparkles,
  PenTool,
  Lightbulb,
  Save,
  Upload,
  Zap,
  Home,
  ChevronRight,
  Play,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";

const HowToUse = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("getting-started");

  // Function to handle tab switching
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // Scroll to top when changing tabs
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - Enhanced with better styling */}
      <header className="border-b py-3 px-4 bg-background/95 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-secondary/80 transition-colors"
              title="Back to Home"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </button>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              How to Use Velora
            </h1>
          </div>
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Home className="h-4 w-4 mr-1.5" />
            Return Home
          </button>
        </div>
      </header>

      {/* Main content with tabs */}
      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar navigation */}
        <aside className="md:w-64 lg:w-72 border-r md:h-[calc(100vh-57px)] md:sticky md:top-[57px] bg-background/95 backdrop-blur-sm">
          <nav className="p-4">
            <div className="space-y-1">
              <button
                onClick={() => handleTabChange("getting-started")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === "getting-started"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-secondary/50 text-foreground"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                <span>Getting Started</span>
                {activeTab === "getting-started" && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </button>

              <button
                onClick={() => handleTabChange("chat-features")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === "chat-features"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-secondary/50 text-foreground"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat Features</span>
                {activeTab === "chat-features" && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </button>

              <button
                onClick={() => handleTabChange("creating-content")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === "creating-content"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-secondary/50 text-foreground"
                }`}
              >
                <Wand2 className="h-4 w-4" />
                <span>Creating Content</span>
                {activeTab === "creating-content" && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </button>

              <button
                onClick={() => handleTabChange("tips")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === "tips"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-secondary/50 text-foreground"
                }`}
              >
                <Lightbulb className="h-4 w-4" />
                <span>Tips & Tricks</span>
                {activeTab === "tips" && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </button>

              <button
                onClick={() => handleTabChange("faq")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === "faq"
                    ? "bg-primary/10 text-primary font-medium"
                    : "hover:bg-secondary/50 text-foreground"
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>FAQ</span>
                {activeTab === "faq" && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </button>
            </div>

            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="text-sm font-medium mb-2 text-primary">
                Quick Start
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                New to Velora? Watch our quick tutorial to get started in under
                2 minutes.
              </p>
              <button
                onClick={() => {
                  // Implement video tutorial functionality
                  alert("Video tutorial coming soon!");
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <Play className="h-3 w-3" />
                <span>Watch Tutorial</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto max-w-4xl px-4 py-8">
            {/* Getting Started Tab */}
            {activeTab === "getting-started" && (
              <div>
                <div className="mb-8">
                  <div className="inline-block bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-3">
                    Guide
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Welcome to Velora</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Velora is your portal to living conversations with AI
                    characters. This guide will help you get the most out of
                    your experience.
                  </p>
                </div>

                {/* Visual step-by-step guide */}
                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Quick Start Guide
                  </h3>
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">
                          Choose how to start
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Select one of the three options on the home page:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-primary/10 flex flex-col items-center text-center">
                            <Sparkles className="h-5 w-5 text-primary mb-2" />
                            <span className="text-sm font-medium">
                              Quick Start
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Fastest option
                            </span>
                          </div>
                          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-primary/10 flex flex-col items-center text-center">
                            <Users className="h-5 w-5 text-primary mb-2" />
                            <span className="text-sm font-medium">
                              Select Characters
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Choose specific characters
                            </span>
                          </div>
                          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-primary/10 flex flex-col items-center text-center">
                            <Wand2 className="h-5 w-5 text-primary mb-2" />
                            <span className="text-sm font-medium">
                              Create Scenario
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Custom experience
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Start chatting</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Once your chat room is set up, you can:
                        </p>
                        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-primary/10 mt-2">
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                Type messages as yourself or take on the role of
                                any character
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                Use *asterisks* to describe actions (e.g.,
                                *smiles warmly*)
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                Add narration to set the scene or move the story
                                forward
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                Let AI characters respond automatically or
                                prompt specific characters to speak
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">
                          Save your experience
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          When you're done, you can save your chat to continue
                          later:
                        </p>
                        <div className="bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-primary/10 flex items-center gap-3 mt-2">
                          <Save className="h-5 w-5 text-primary flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">
                              Click "Save Chat" in the top right
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Your chat will be downloaded as a JSON file
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Getting Started</span>
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Velora offers multiple ways to start a conversation:
                    </p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5 mr-2">
                          <Sparkles className="h-3.5 w-3.5" />
                        </div>
                        <span>
                          <strong>Quick Start:</strong> Choose from pre-made
                          scenarios based on themes
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5 mr-2">
                          <Users className="h-3.5 w-3.5" />
                        </div>
                        <span>
                          <strong>Select Characters:</strong> Browse and choose
                          specific characters to chat with
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5 mr-2">
                          <Wand2 className="h-3.5 w-3.5" />
                        </div>
                        <span>
                          <strong>Create Custom Scenario:</strong> Design your
                          own scenario or let AI generate one
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      <span>No Login Required</span>
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Velora is designed for immediate use without any account
                      creation:
                    </p>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5 mr-2">
                          <Save className="h-3.5 w-3.5" />
                        </div>
                        <span>
                          <strong>Save Chats:</strong> Download your
                          conversations as JSON files to continue later
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5 mr-2">
                          <Upload className="h-3.5 w-3.5" />
                        </div>
                        <span>
                          <strong>Upload Chats:</strong> Resume previous
                          conversations by uploading saved files
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5 mr-2">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>
                          <strong>Private:</strong> All conversations stay on
                          your device unless you choose to save them
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Features Tab */}
            {activeTab === "chat-features" && (
              <div>
                <div className="mb-8">
                  <div className="inline-block bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-3">
                    Features
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Chat Features</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Velora offers a rich set of features to make your
                    conversations engaging and immersive.
                  </p>
                </div>

                {/* Chat interface overview */}
                <div className="bg-background/60 backdrop-blur-md rounded-xl border border-primary/20 shadow-lg overflow-hidden mb-8">
                  <div className="p-4 border-b border-primary/10 flex items-center justify-between">
                    <h3 className="font-medium">Chat Interface Overview</h3>
                  </div>
                  <div className="p-6">
                    <div className="bg-secondary/10 rounded-xl p-6 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Message Area</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                <strong>Character Messages:</strong> Messages
                                from AI characters appear on the left
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                <strong>Your Messages:</strong> Your messages
                                appear on the right
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                <strong>System Messages:</strong> Narration and
                                scene descriptions appear centered
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">Input Area</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                <strong>Character Selection:</strong> Choose
                                which character you're speaking as
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                <strong>Message Input:</strong> Type your
                                message or actions
                              </span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>
                                <strong>Quick Actions:</strong> Access common
                                actions like narration
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-3">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <h4 className="font-medium mb-2">Character Messages</h4>
                        <p className="text-sm text-muted-foreground">
                          Messages from AI characters appear with their name and
                          avatar.
                        </p>
                      </div>

                      <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-3">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <h4 className="font-medium mb-2">Narration</h4>
                        <p className="text-sm text-muted-foreground">
                          Add scene descriptions and narrative elements to set
                          the mood.
                        </p>
                      </div>

                      <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-3">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <h4 className="font-medium mb-2">Actions</h4>
                        <p className="text-sm text-muted-foreground">
                          Use *asterisks* to describe actions your character is
                          taking.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div className="space-y-6 mb-8">
                  <h3 className="text-xl font-semibold">Key Chat Features</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                      <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>Character Actions</span>
                      </h4>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Make your conversations more immersive by including
                        actions:
                      </p>
                      <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium mb-1">Example:</p>
                        <p className="text-sm">
                          Hello there! *extends hand for a handshake* I'm
                          Captain Alex.
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Simply wrap your actions in asterisks (*) to distinguish
                        them from regular speech.
                      </p>
                    </div>

                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                      <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span>Narration</span>
                      </h4>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Add narrative elements to set the scene or advance the
                        story:
                      </p>
                      <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium mb-1">How to use:</p>
                        <p className="text-sm">
                          1. Click the "Narrate" button
                          <br />
                          2. Type your narration
                          <br />
                          3. Send to add it to the chat
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Narration appears centered in the chat and is styled
                        differently from regular messages.
                      </p>
                    </div>

                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                      <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span>AI Character Turns</span>
                      </h4>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Let AI characters take their turn in the conversation:
                      </p>
                      <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium mb-1">
                          Two ways to use:
                        </p>
                        <p className="text-sm">
                          1. Click "AI Turn" and select a character
                          <br />
                          2. Toggle "Auto-respond" for automatic replies
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Characters will respond based on the conversation
                        context and their personality.
                      </p>
                    </div>

                    <div className="bg-card rounded-xl border p-6 shadow-sm">
                      <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                        <PenTool className="h-5 w-5 text-primary" />
                        <span>AI Style Instructions</span>
                      </h4>
                      <p className="text-muted-foreground mb-4 text-sm">
                        Guide how AI characters respond to you:
                      </p>
                      <div className="bg-secondary/20 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium mb-1">
                          Example instructions:
                        </p>
                        <p className="text-sm">
                          "Respond in a poetic style"
                          <br />
                          "Keep responses brief and mysterious"
                          <br />
                          "Include technical jargon in your answers"
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Click the "AI Style" button to set custom instructions
                        for AI responses.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Advanced Features */}
                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Advanced Features
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">
                          What Next? Suggestions
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Not sure where to take the conversation? Use the "What
                          Next?" feature to get AI-generated suggestions.
                        </p>
                        <p className="text-xs text-primary">
                          Click the lightbulb icon in the chat interface to see
                          suggestions.
                        </p>
                      </div>
                    </div>

                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Scene Transitions</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Add atmospheric scene transitions to indicate the
                          passage of time or changes in the environment.
                        </p>
                        <p className="text-xs text-primary">
                          Click "Scene Transition" to add a random transition to
                          your chat.
                        </p>
                      </div>
                    </div>

                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <Save className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">
                          Saving & Continuing Chats
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Save your conversations to continue them later or
                          share with friends.
                        </p>
                        <p className="text-xs text-primary">
                          Click the download icon in the chat header to save
                          your chat as a JSON file.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Creating Content Tab */}
            {activeTab === "creating-content" && (
              <div>
                <div className="mb-8">
                  <div className="inline-block bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-3">
                    Create
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Creating Content</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Learn how to create custom characters and scenarios to make
                    your Velora experience uniquely yours.
                  </p>
                </div>

                {/* Character Creation */}
                <div className="bg-background/60 backdrop-blur-md rounded-xl border border-primary/20 shadow-lg overflow-hidden mb-8">
                  <div className="p-4 border-b border-primary/10 flex items-center justify-between">
                    <h3 className="font-medium">Character Creation</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <span>Creating Characters</span>
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Velora offers two ways to create characters:
                        </p>

                        <div className="space-y-4">
                          <div className="bg-secondary/10 rounded-lg p-4">
                            <h5 className="font-medium mb-2 text-sm">
                              AI-Generated Characters
                            </h5>
                            <ol className="space-y-2 text-sm list-decimal pl-4">
                              <li>
                                Click "Select Characters" on the home page
                              </li>
                              <li>Choose "Generate Character with AI"</li>
                              <li>
                                Enter keywords describing the character you want
                              </li>
                              <li>Review and edit the generated character</li>
                              <li>Click "Add to Chat" to include them</li>
                            </ol>
                          </div>

                          <div className="bg-secondary/10 rounded-lg p-4">
                            <h5 className="font-medium mb-2 text-sm">
                              Custom Characters
                            </h5>
                            <ol className="space-y-2 text-sm list-decimal pl-4">
                              <li>
                                Click "Select Characters" on the home page
                              </li>
                              <li>Choose "Create Custom Character"</li>
                              <li>Fill in the character details manually</li>
                              <li>Click "Add to Chat" when finished</li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl p-6">
                        <h4 className="font-medium mb-4">
                          Character Properties
                        </h4>
                        <div className="space-y-4">
                          <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-3">
                            <h5 className="text-sm font-medium mb-1">Name</h5>
                            <p className="text-xs text-muted-foreground">
                              The character's full name
                            </p>
                          </div>

                          <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-3">
                            <h5 className="text-sm font-medium mb-1">
                              Description
                            </h5>
                            <p className="text-xs text-muted-foreground">
                              Physical appearance, age, and other visual details
                            </p>
                          </div>

                          <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-3">
                            <h5 className="text-sm font-medium mb-1">
                              Personality
                            </h5>
                            <p className="text-xs text-muted-foreground">
                              Character traits, quirks, and behavioral patterns
                            </p>
                          </div>

                          <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-3">
                            <h5 className="text-sm font-medium mb-1">
                              Background
                            </h5>
                            <p className="text-xs text-muted-foreground">
                              History, origins, and important life events
                            </p>
                          </div>

                          <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-3">
                            <h5 className="text-sm font-medium mb-1">Voice</h5>
                            <p className="text-xs text-muted-foreground">
                              How the character speaks, including accent,
                              vocabulary, and speech patterns
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-primary/5 rounded-lg p-4 border border-primary/10">
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Pro Tip: Character Creation</span>
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        For the most engaging characters, include contradictions
                        and flaws. Perfect characters are less interesting than
                        those with internal conflicts and room to grow.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scenario Creation */}
                <div className="bg-background/60 backdrop-blur-md rounded-xl border border-primary/20 shadow-lg overflow-hidden mb-8">
                  <div className="p-4 border-b border-primary/10 flex items-center justify-between">
                    <h3 className="font-medium">Scenario Creation</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                          <Wand2 className="h-5 w-5 text-primary" />
                          <span>Creating Scenarios</span>
                        </h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Scenarios set the stage for your conversations. Here's
                          how to create them:
                        </p>

                        <div className="space-y-4">
                          <div className="bg-secondary/10 rounded-lg p-4">
                            <h5 className="font-medium mb-2 text-sm">
                              AI-Generated Scenarios
                            </h5>
                            <ol className="space-y-2 text-sm list-decimal pl-4">
                              <li>Click "Create Scenario" on the home page</li>
                              <li>
                                Enter keywords describing the scenario you want
                              </li>
                              <li>Review and edit the generated scenario</li>
                              <li>
                                Click "Continue" to select or create characters
                              </li>
                              <li>Click "Start Chat" when ready</li>
                            </ol>
                          </div>

                          <div className="bg-secondary/10 rounded-lg p-4">
                            <h5 className="font-medium mb-2 text-sm">
                              Custom Scenarios
                            </h5>
                            <ol className="space-y-2 text-sm list-decimal pl-4">
                              <li>Click "Create Scenario" on the home page</li>
                              <li>Choose "Create Custom Scenario"</li>
                              <li>Fill in the scenario details manually</li>
                              <li>
                                Click "Continue" to select or create characters
                              </li>
                              <li>Click "Start Chat" when ready</li>
                            </ol>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl p-6 mb-6">
                          <h4 className="font-medium mb-4">
                            Scenario Elements
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-3">
                              <h5 className="text-sm font-medium mb-1">
                                Setting
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                Where and when the scenario takes place
                              </p>
                            </div>

                            <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-3">
                              <h5 className="text-sm font-medium mb-1">
                                Situation
                              </h5>
                              <p className="text-xs text-muted-foreground">
                                The current circumstances or problem to be
                                addressed
                              </p>
                            </div>

                            <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-3">
                              <h5 className="text-sm font-medium mb-1">Mood</h5>
                              <p className="text-xs text-muted-foreground">
                                The emotional tone of the scenario (tense,
                                lighthearted, mysterious, etc.)
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card rounded-lg border p-4">
                          <h4 className="font-medium mb-3">
                            Example Scenario Keywords
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="bg-secondary/20 rounded p-2">
                              space exploration, alien encounter, diplomatic
                              mission
                            </div>
                            <div className="bg-secondary/20 rounded p-2">
                              medieval tavern, adventurers, quest planning
                            </div>
                            <div className="bg-secondary/20 rounded p-2">
                              cyberpunk city, corporate espionage, rogue AI
                            </div>
                            <div className="bg-secondary/20 rounded p-2">
                              haunted mansion, paranormal investigators, mystery
                            </div>
                            <div className="bg-secondary/20 rounded p-2">
                              royal court, political intrigue, secret alliance
                            </div>
                            <div className="bg-secondary/20 rounded p-2">
                              desert oasis, travelers, ancient artifact
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 bg-primary/5 rounded-lg p-4 border border-primary/10">
                      <h5 className="font-medium mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>Pro Tip: Scenario Creation</span>
                      </h5>
                      <p className="text-sm text-muted-foreground">
                        The best scenarios have clear stakes but leave room for
                        character choices. Include a situation that needs
                        resolution but don't prescribe exactly how it should be
                        solved.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Start Templates */}
                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Quick Start Templates
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Not sure where to begin? Try one of these pre-made templates
                    to get started quickly:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4">
                      <h4 className="font-medium mb-2">Space Adventure</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Explore the cosmos with a crew of diverse characters
                        aboard a starship.
                      </p>
                      <div className="text-xs text-primary">
                        Available in Quick Start
                      </div>
                    </div>

                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4">
                      <h4 className="font-medium mb-2">Fantasy Quest</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Join a party of adventurers in a magical world filled
                        with wonder and danger.
                      </p>
                      <div className="text-xs text-primary">
                        Available in Quick Start
                      </div>
                    </div>

                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4">
                      <h4 className="font-medium mb-2">Detective Mystery</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Solve a perplexing case with a team of investigators in
                        a noir-inspired setting.
                      </p>
                      <div className="text-xs text-primary">
                        Available in Quick Start
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tips & Tricks Tab */}
            {activeTab === "tips" && (
              <div>
                <div className="mb-8">
                  <div className="inline-block bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-3">
                    Tips
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Tips & Tricks</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Master Velora with these expert tips and tricks to create
                    more engaging conversations.
                  </p>
                </div>

                {/* Tips cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span>Creating Engaging Conversations</span>
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>
                          <strong>Ask open-ended questions</strong> that can't
                          be answered with just "yes" or "no"
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>
                          <strong>Include actions</strong> to make your messages
                          more dynamic and expressive
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>
                          <strong>React to what characters say</strong> rather
                          than changing the subject abruptly
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>
                          <strong>Create moments of tension</strong> by
                          introducing challenges or conflicts
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-card rounded-xl border p-6 shadow-sm">
                    <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-primary" />
                      <span>Advanced Character Interactions</span>
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>
                          <strong>Switch between characters</strong> to create
                          dialogue between multiple AI characters
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>
                          <strong>Use narration</strong> to set the scene or
                          advance time in the story
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>
                          <strong>Customize AI instructions</strong> to guide
                          the tone and style of responses
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>
                          <strong>Use "What Next?" suggestions</strong> when
                          you're not sure how to proceed
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Pro tips */}
                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">
                    Pro Tips for Immersive Experiences
                  </h3>

                  <div className="space-y-6">
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>Creating Story Arcs</span>
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Structure your conversations to follow a narrative arc
                        for more satisfying experiences:
                      </p>
                      <ol className="space-y-2 text-sm list-decimal pl-4">
                        <li>
                          <strong>Introduction:</strong> Establish the setting
                          and characters
                        </li>
                        <li>
                          <strong>Rising Action:</strong> Introduce a problem or
                          challenge
                        </li>
                        <li>
                          <strong>Climax:</strong> Reach a critical moment or
                          decision point
                        </li>
                        <li>
                          <strong>Resolution:</strong> Resolve the situation and
                          reflect on outcomes
                        </li>
                      </ol>
                    </div>

                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <PenTool className="h-5 w-5 text-primary" />
                        <span>Writing Effective AI Instructions</span>
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Customize how AI characters respond with these
                        instruction patterns:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-secondary/20 rounded p-2 text-xs">
                          "Respond in a [style] manner with [specific details]"
                        </div>
                        <div className="bg-secondary/20 rounded p-2 text-xs">
                          "Keep your responses [length] and focus on [topic]"
                        </div>
                        <div className="bg-secondary/20 rounded p-2 text-xs">
                          "Include [specific elements] in your responses"
                        </div>
                        <div className="bg-secondary/20 rounded p-2 text-xs">
                          "Avoid [specific topics] and emphasize [preferred
                          topics]"
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keyboard shortcuts */}
                <div className="bg-card rounded-xl border p-6 shadow-sm">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Keyboard Shortcuts</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Speed up your interactions with these helpful keyboard
                    shortcuts:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                      <span>Send message</span>
                      <span className="font-mono bg-secondary/30 px-2 py-0.5 rounded text-xs">
                        Enter
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                      <span>New line in message</span>
                      <span className="font-mono bg-secondary/30 px-2 py-0.5 rounded text-xs">
                        Shift + Enter
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                      <span>Toggle narration mode</span>
                      <span className="font-mono bg-secondary/30 px-2 py-0.5 rounded text-xs">
                        Alt + N
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/10 rounded">
                      <span>Toggle AI instructions</span>
                      <span className="font-mono bg-secondary/30 px-2 py-0.5 rounded text-xs">
                        Alt + I
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <div>
                <div className="mb-8">
                  <div className="inline-block bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-3">
                    FAQ
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    Frequently Asked Questions
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    Find answers to common questions about using Velora.
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="bg-card rounded-xl border p-5 shadow-sm">
                    <h3 className="text-lg font-medium mb-2">
                      Do I need to create an account to use Velora?
                    </h3>
                    <p className="text-muted-foreground">
                      No, Velora is designed for immediate use without any
                      account creation or sign-up process. You can start
                      chatting right away.
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border p-5 shadow-sm">
                    <h3 className="text-lg font-medium mb-2">
                      How do I save my conversations?
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      You can save your conversations by clicking the Download
                      icon in the chat header. This will save your chat as a
                      JSON file that you can upload later to continue the
                      conversation.
                    </p>
                    <div className="bg-secondary/10 rounded-lg p-3 flex items-center gap-3">
                      <Save className="h-5 w-5 text-primary flex-shrink-0" />
                      <p className="text-sm">
                        Look for this icon in the top-right corner of the chat
                        interface.
                      </p>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border p-5 shadow-sm">
                    <h3 className="text-lg font-medium mb-2">
                      Can I create my own characters?
                    </h3>
                    <p className="text-muted-foreground">
                      Yes, you can create custom characters in two ways: by
                      using the AI character generator with keywords, or by
                      manually filling in character details yourself. Both
                      options are available when you click "Select Characters"
                      on the home page.
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border p-5 shadow-sm">
                    <h3 className="text-lg font-medium mb-2">
                      How do I make characters perform actions?
                    </h3>
                    <p className="text-muted-foreground">
                      To include actions in your messages, simply wrap the
                      action text in asterisks (*). For example: "Hello there!
                      *extends hand for a handshake* Nice to meet you."
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border p-5 shadow-sm">
                    <h3 className="text-lg font-medium mb-2">
                      Is my data private?
                    </h3>
                    <p className="text-muted-foreground">
                      Yes, your conversations in Velora are private. Since
                      there's no account system, your chats are stored locally
                      in your browser. If you want to save them permanently, you
                      need to download them using the Save Chat feature.
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border p-5 shadow-sm">
                    <h3 className="text-lg font-medium mb-2">
                      Can I use Velora on mobile devices?
                    </h3>
                    <p className="text-muted-foreground">
                      Yes, Velora is fully responsive and works on smartphones
                      and tablets. The interface will adapt to your screen size
                      for the best experience on any device.
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border p-5 shadow-sm">
                    <h3 className="text-lg font-medium mb-2">
                      How do I get the AI to respond as a specific character?
                    </h3>
                    <p className="text-muted-foreground">
                      You can prompt a specific AI character to respond by
                      clicking the "AI Turn" button and selecting the character
                      you want to speak. Alternatively, you can toggle
                      "Auto-respond" to have characters respond automatically.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Still Have Questions?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you couldn't find the answer to your question, here are
                    some additional resources:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Contact Support</h4>
                        <p className="text-xs text-muted-foreground">
                          Reach out to our support team for personalized help
                        </p>
                      </div>
                    </div>
                    <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-primary/10 p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Documentation</h4>
                        <p className="text-xs text-muted-foreground">
                          Browse our detailed documentation for in-depth guides
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container mx-auto max-w-4xl px-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Made with love, coffee and vibe coding by{" "}
            <a
              href="https://www.linkedin.com/in/saurao-dalvi/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors underline"
            >
              Saurao Dalvi
            </a>
          </p>
          <button
            onClick={onBack}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Return to Velora
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HowToUse;
