"use client";

import { useState, useEffect } from "react";
import {
  fetchAllIssues,
  updateIssueStatus,
  deleteIssue,

  updateIssuePriority,
} from "@/utils/actions";
import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  Link as LinkIcon,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Type definitions based on your Prisma schema
type IssueStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
type IssuePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Issue {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  workflowUrl: string | null;
  content: string;
  status: IssueStatus;
  priority: IssuePriority;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    profileImage?: string;
  } | null;
}

const IssuesManagementPage = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all"); // ← Add priority filter
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    loadIssues();
  }, []);

  // Filter issues when filters change
  useEffect(() => {
    filterIssues();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issues, searchTerm, statusFilter, priorityFilter]); // ← Add priorityFilter

  const loadIssues = async () => {
    setIsLoading(true);
    try {
      const issuesData = await fetchAllIssues();
      setIssues(issuesData);
    } catch (error) {
      console.error("Error loading issues:", error);
      toast.error("Failed to load issues");
    } finally {
      setIsLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (issue) =>
          issue.name.toLowerCase().includes(search) ||
          issue.content.toLowerCase().includes(search) ||
          issue.email?.toLowerCase().includes(search) ||
          issue.user?.firstName.toLowerCase().includes(search) ||
          issue.user?.lastName.toLowerCase().includes(search)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    // Priority filter ← Add this
    if (priorityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter);
    }

    setFilteredIssues(filtered);
  };

  const handleStatusUpdate = async (
    issueId: string,
    newStatus: IssueStatus
  ) => {
    try {
      const result = await updateIssueStatus(issueId, newStatus);
      if (result.success) {
        toast.success(result.message);
        loadIssues(); // Refresh data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  // ← Add priority update handler
  const handlePriorityUpdate = async (
    issueId: string,
    newPriority: IssuePriority
  ) => {
    try {
      const result = await updateIssuePriority(issueId, newPriority); // ← Using this function
      if (result.success) {
        toast.success(result.message);
        loadIssues();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update priority");
    }
  };

  const handleDeleteIssue = async (issueId: string) => {
    try {
      const result = await deleteIssue(issueId);
      if (result.success) {
        toast.success(result.message);
        setIsDeleteDialogOpen(false);
        setIssueToDelete(null);
        loadIssues(); // Refresh data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete issue");
    }
  };

  // Helper functions
  const getStatusIcon = (status: IssueStatus) => {
    switch (status) {
      case "OPEN":
        return <AlertCircle className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <Clock className="h-4 w-4" />;
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />;
      case "CLOSED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "IN_PROGRESS":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "RESOLVED":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "CLOSED":
        return "bg-gray-500/10 text-gray-600 border-gray-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: IssuePriority) => {
    switch (priority) {
      case "LOW":
        return <BarChart3 className="h-4 w-4" />;
      case "MEDIUM":
        return <AlertTriangle className="h-4 w-4" />;
      case "HIGH":
        return <AlertCircle className="h-4 w-4" />;
      case "URGENT":
        return <Zap className="h-4 w-4" />;
      default:
        return <BarChart3 className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: IssuePriority) => {
    switch (priority) {
      case "LOW":
        return "bg-gray-500/10 text-gray-600 border-gray-200";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "HIGH":
        return "bg-orange-500/10 text-orange-600 border-orange-200";
      case "URGENT":
        return "bg-red-500/10 text-red-600 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  // Calculate stats from current issues
  const stats = {
    total: issues.length,
    open: issues.filter((i) => i.status === "OPEN").length,
    inProgress: issues.filter((i) => i.status === "IN_PROGRESS").length,
    resolved: issues.filter((i) => i.status === "RESOLVED").length,
    closed: issues.filter((i) => i.status === "CLOSED").length,
    urgent: issues.filter((i) => i.priority === "URGENT").length,
    high: issues.filter((i) => i.priority === "HIGH").length,
    medium: issues.filter((i) => i.priority === "MEDIUM").length,
    low: issues.filter((i) => i.priority === "LOW").length,
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading issues...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Issues Management</h1>
          <p className="text-muted-foreground">
            Manage and track all reported issues from users
          </p>
        </div>
        <Button onClick={loadIssues} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Issues</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-blue-600">{stats.open}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.inProgress}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.resolved}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Priority Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <Zap className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Urgent</p>
              <p className="text-xl font-bold text-red-600">{stats.urgent}</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">High</p>
              <p className="text-xl font-bold text-orange-600">{stats.high}</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <AlertTriangle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Medium</p>
              <p className="text-xl font-bold text-blue-600">{stats.medium}</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <BarChart3 className="h-6 w-6 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Low</p>
              <p className="text-xl font-bold text-gray-600">{stats.low}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters - Updated to include priority filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>

            {/* ← Add priority filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              Showing {filteredIssues.length} of {issues.length} issues
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-muted-foreground">
                {issues.length === 0
                  ? "No issues found"
                  : "No issues match your filters"}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredIssues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={getStatusColor(issue.status)}>
                        {getStatusIcon(issue.status)}
                        <span className="ml-1">
                          {issue.status.replace("_", " ")}
                        </span>
                      </Badge>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {getPriorityIcon(issue.priority)}
                        <span className="ml-1">{issue.priority}</span>
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDistanceToNow(new Date(issue.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-1">
                        Reported by: {issue.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {issue.content}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {issue.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <a
                            href={`mailto:${issue.email}`}
                            className="text-primary hover:underline"
                          >
                            {issue.email}
                          </a>
                        </div>
                      )}
                      {issue.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <a
                            href={`tel:${issue.phone}`}
                            className="text-primary hover:underline"
                          >
                            {issue.phone}
                          </a>
                        </div>
                      )}
                      {issue.workflowUrl && (
                        <div className="flex items-center gap-1">
                          <LinkIcon className="h-4 w-4" />
                          <a
                            href={issue.workflowUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            View Workflow
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      {issue.user && (
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {issue.user.firstName} {issue.user.lastName} (
                          {issue.user.username})
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ← Updated action buttons section */}
                  <div className="flex flex-col gap-2 lg:min-w-[200px]">
                    {/* Status selector */}
                    <Select
                      value={issue.status}
                      onValueChange={(value) =>
                        handleStatusUpdate(issue.id, value as IssueStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* ← Add priority selector */}
                    <Select
                      value={issue.priority}
                      onValueChange={(value) =>
                        handlePriorityUpdate(issue.id, value as IssuePriority)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low Priority</SelectItem>
                        <SelectItem value="MEDIUM">Medium Priority</SelectItem>
                        <SelectItem value="HIGH">High Priority</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Dialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedIssue(issue);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Issue Details</DialogTitle>
                            <DialogDescription>
                              Full details for issue #
                              {selectedIssue?.id.slice(-8)}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedIssue && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">
                                    Reporter
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedIssue.name}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Created
                                  </label>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(
                                      selectedIssue.createdAt
                                    ).toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Status
                                  </label>
                                  <Badge
                                    className={getStatusColor(
                                      selectedIssue.status
                                    )}
                                  >
                                    {selectedIssue.status.replace("_", " ")}
                                  </Badge>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    Priority
                                  </label>
                                  <Badge
                                    className={getPriorityColor(
                                      selectedIssue.priority
                                    )}
                                  >
                                    {selectedIssue.priority}
                                  </Badge>
                                </div>
                                {selectedIssue.email && (
                                  <div>
                                    <label className="text-sm font-medium">
                                      Email
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedIssue.email}
                                    </p>
                                  </div>
                                )}
                                {selectedIssue.phone && (
                                  <div>
                                    <label className="text-sm font-medium">
                                      Phone
                                    </label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedIssue.phone}
                                    </p>
                                  </div>
                                )}
                              </div>
                              {selectedIssue.workflowUrl && (
                                <div>
                                  <label className="text-sm font-medium">
                                    Workflow URL
                                  </label>
                                  <p className="text-sm">
                                    <a
                                      href={selectedIssue.workflowUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline"
                                    >
                                      {selectedIssue.workflowUrl}
                                    </a>
                                  </p>
                                </div>
                              )}
                              <Separator />
                              <div>
                                <label className="text-sm font-medium">
                                  Issue Description
                                </label>
                                <ScrollArea className="h-32 mt-2">
                                  <p className="text-sm whitespace-pre-wrap">
                                    {selectedIssue.content}
                                  </p>
                                </ScrollArea>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Dialog
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setIssueToDelete(issue.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Issue</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this issue? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setIssueToDelete(null);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() =>
                                issueToDelete &&
                                handleDeleteIssue(issueToDelete)
                              }
                            >
                              Delete Issue
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default IssuesManagementPage;
