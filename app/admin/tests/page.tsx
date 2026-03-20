"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash2, Loader2, RefreshCw, ChevronLeft, ListChecks, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { SUBJECT_MAPPING, formatSubjectName } from "@/utils/subjects";

export default function TestsDashboard() {
  const supabase = createClient();
  const { toast } = useToast();
  
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddTest, setShowAddTest] = useState(false);
  const [savingTest, setSavingTest] = useState(false);
  const [editingTestId, setEditingTestId] = useState<string | null>(null);

  // Selected test for managing questions
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  // Form State - Test
  const [testName, setTestName] = useState("");
  const [testCategory, setTestCategory] = useState("");

  // Form State - Question
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const allSubjects = [
    ...SUBJECT_MAPPING.foundation,
    ...SUBJECT_MAPPING.intermediate,
    ...SUBJECT_MAPPING.final
  ];

  const fetchTests = async () => {
    setLoading(true);
    const { data } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
    if (data) setTests(data);
    setLoading(false);
  };

  const fetchQuestions = async (testId: string) => {
    setLoadingQuestions(true);
    const { data } = await supabase.from('questions').select('*').eq('test_id', testId).order('created_at', { ascending: true });
    if (data) setQuestions(data);
    setLoadingQuestions(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleEditTest = (test: any) => {
    setTestName(test.name);
    setTestCategory(test.category);
    setEditingTestId(test.id);
    setShowAddTest(true);
  };

  const handleAddTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingTest(true);

    const payload = {
      name: testName,
      category: testCategory,
    };

    let error;
    if (editingTestId) {
      const { error: updateError } = await supabase.from('tests').update(payload).eq('id', editingTestId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('tests').insert(payload);
      error = insertError;
    }

    if (error) {
      toast({ title: `Error ${editingTestId ? 'updating' : 'adding'} test`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Test ${editingTestId ? 'updated' : 'added'}!` });
      setTestName(""); setTestCategory("");
      setEditingTestId(null);
      setShowAddTest(false);
      fetchTests();
    }
    setSavingTest(false);
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm("Are you sure? This will delete all questions in this test as well.")) return;
    const { error } = await supabase.from('tests').delete().eq('id', id);
    if (!error) fetchTests();
  };

  const handleEditQuestion = (question: any) => {
    setQuestionText(question.question_text);
    setOptionA(question.option_a);
    setOptionB(question.option_b);
    setOptionC(question.option_c);
    setOptionD(question.option_d);
    setCorrectAnswer(question.correct_answer);
    setEditingQuestionId(question.id);
    setShowAddQuestion(true);
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingQuestion(true);

    const payload = {
      test_id: selectedTest.id,
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_answer: correctAnswer,
    };

    let error;
    if (editingQuestionId) {
      const { error: updateError } = await supabase.from('questions').update(payload).eq('id', editingQuestionId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('questions').insert(payload);
      error = insertError;
    }

    if (error) {
      toast({ title: `Error ${editingQuestionId ? 'updating' : 'adding'} question`, description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Question ${editingQuestionId ? 'updated' : 'added'}!` });
      setQuestionText(""); setOptionA(""); setOptionB(""); setOptionC(""); setOptionD(""); setCorrectAnswer("");
      setEditingQuestionId(null);
      setShowAddQuestion(false);
      fetchQuestions(selectedTest.id);
      fetchTests(); // Refresh question count on test list
    }
    setSavingQuestion(false);
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from('questions').delete().eq('id', id);
    if (!error) {
        fetchQuestions(selectedTest.id);
        fetchTests();
    }
  };

  if (selectedTest) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setSelectedTest(null)}><ChevronLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Questions</h1>
            <p className="text-muted-foreground mt-1">Test: {selectedTest.name} ({formatSubjectName(selectedTest.category as any)})</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="icon" onClick={() => fetchQuestions(selectedTest.id)}><RefreshCw className="h-4 w-4" /></Button>
            <Button onClick={() => setShowAddQuestion(!showAddQuestion)} className="gap-2">
              <Plus className="h-4 w-4" /> {showAddQuestion ? "Cancel" : "Add MCQ"}
            </Button>
          </div>
        </div>

        {showAddQuestion && (
          <Card className="border-border">
            <CardHeader><CardTitle>{editingQuestionId ? "Edit Question" : "Add New Question"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Question Text</label>
                  <Textarea required value={questionText} onChange={e => setQuestionText(e.target.value)} placeholder="Type question here..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Option A</label>
                    <Input required value={optionA} onChange={e => setOptionA(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Option B</label>
                    <Input required value={optionB} onChange={e => setOptionB(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Option C</label>
                    <Input required value={optionC} onChange={e => setOptionC(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Option D</label>
                    <Input required value={optionD} onChange={e => setOptionD(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2 w-full md:w-1/2">
                  <label className="text-sm font-medium">Correct Answer</label>
                  <Select required value={correctAnswer} onValueChange={setCorrectAnswer}>
                    <SelectTrigger><SelectValue placeholder="Select correct option" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Option A</SelectItem>
                      <SelectItem value="B">Option B</SelectItem>
                      <SelectItem value="C">Option C</SelectItem>
                      <SelectItem value="D">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={savingQuestion}>
                    {savingQuestion ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingQuestionId ? "Update Question" : "Save Question")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          {loadingQuestions ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Options</TableHead>
                  <TableHead>Answer</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No questions added yet.</TableCell>
                  </TableRow>
                )}
                {questions.map((q, i) => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium max-w-sm">
                        <span className="text-muted-foreground mr-2">{i+1}.</span>
                        {q.question_text}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-sm">
                      <div className="grid grid-cols-2 gap-1">
                        <div className={q.correct_answer === 'A' ? "text-primary font-semibold" : ""}>A) {q.option_a}</div>
                        <div className={q.correct_answer === 'B' ? "text-primary font-semibold" : ""}>B) {q.option_b}</div>
                        <div className={q.correct_answer === 'C' ? "text-primary font-semibold" : ""}>C) {q.option_c}</div>
                        <div className={q.correct_answer === 'D' ? "text-primary font-semibold" : ""}>D) {q.option_d}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-primary">{q.correct_answer}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" onClick={() => handleEditQuestion(q)} className="text-muted-foreground hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(q.id)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mock Tests & MCQs</h1>
          <p className="text-muted-foreground mt-1">Manage practice tests and questions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchTests}><RefreshCw className="h-4 w-4" /></Button>
          <Button onClick={() => setShowAddTest(!showAddTest)} className="gap-2">
            <Plus className="h-4 w-4" /> {showAddTest ? "Cancel" : "Add Test"}
          </Button>
        </div>
      </div>

      {showAddTest && (
        <Card className="border-border">
          <CardHeader><CardTitle>{editingTestId ? "Edit Mock Test" : "Add New Mock Test"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleAddTest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Test Name</label>
                <Input required value={testName} onChange={e => setTestName(e.target.value)} placeholder="E.g. Accounting Chapter 1" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject Category</label>
                <Select required value={testCategory} onValueChange={setTestCategory}>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {allSubjects.map(sub => (
                      <SelectItem key={sub} value={sub}>{formatSubjectName(sub as any)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-full pt-2">
                <Button type="submit" disabled={savingTest}>
                  {savingTest ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingTestId ? "Update Test" : "Save Test")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Questions Count</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">No tests found.</TableCell>
                </TableRow>
              )}
              {tests.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{formatSubjectName(t.category as any)}</TableCell>
                  <TableCell>{t.questions_count}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedTest(t); fetchQuestions(t.id); }} className="gap-2">
                            <ListChecks className="h-4 w-4" /> Manage
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEditTest(t)} className="text-muted-foreground hover:text-primary">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTest(t.id)} className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
