// Types
export interface Customer {
  id: string
  name: string
  phoneNumber: string
  email: string
  query: string
  status: "New" | "In Progress" | "Closed" | "Sold"
  source: string
  followUpLevel: 1 | 2 | 3 | 4
  tags: {
    course?: string
    subject?: string
    term?: string
    faculty?: string
    custom?: string[]
  }
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

export interface Interaction {
  id: string
  customerId: string
  notes: string
  status: "New" | "In Progress" | "Closed" | "Sold"
  followUpLevel: 1 | 2 | 3 | 4
  createdAt: string
  createdBy: string
}

export interface Task {
  id: string
  customerId: string
  customerName: string
  query: string
  deadline: string
  priority: "Low" | "Medium" | "High"
  status: "Pending" | "Completed"
  assignedTo: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "staff"
  createdAt: string
}

export interface Source {
  id: string
  name: string
}

export interface Tag {
  id: string
  name: string
  type: "course" | "subject" | "term" | "faculty" | "custom"
  parentId?: string // For dependent tags like subjects
}

// Initialize localStorage with sample data if empty
export function initializeData() {
  // Check if data already exists
  if (!localStorage.getItem("customers")) {
    // Sample sources
    const sources: Source[] = [
      { id: "1", name: "Website" },
      { id: "2", name: "Phone Inquiry" },
      { id: "3", name: "Referral" },
      { id: "4", name: "Social Media" },
      { id: "5", name: "Email Campaign" },
    ]

    // Sample tags
    const tags: Tag[] = [
      // Courses
      { id: "1", name: "CA Final", type: "course" },
      { id: "2", name: "CA Inter", type: "course" },
      { id: "3", name: "CA Foundation", type: "course" },

      // Subjects (dependent on courses)
      { id: "4", name: "Accounts", type: "subject", parentId: "1" },
      { id: "5", name: "Law", type: "subject", parentId: "1" },
      { id: "6", name: "Taxation", type: "subject", parentId: "1" },
      { id: "7", name: "Accounts", type: "subject", parentId: "2" },
      { id: "8", name: "Law", type: "subject", parentId: "2" },

      // Terms
      { id: "9", name: "May 2025", type: "term" },
      { id: "10", name: "Nov 2025", type: "term" },
      { id: "11", name: "May 2026", type: "term" },

      // Faculties
      { id: "12", name: "Bhanwar Borana", type: "faculty" },
      { id: "13", name: "Parveen Sharma", type: "faculty" },

      // Custom tags
      { id: "14", name: "Scholarship", type: "custom" },
      { id: "15", name: "Urgent", type: "custom" },
    ]

    // Sample users
    const users: User[] = [
      {
        id: "1",
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Staff User",
        email: "staff@example.com",
        role: "staff",
        createdAt: new Date().toISOString(),
      },
    ]

    // Sample customers
    const customers: Customer[] = [
      {
        id: "1",
        name: "John Smith",
        phoneNumber: "+1 (555) 123-4567",
        email: "john.smith@example.com",
        query: "Interested in CA Final course",
        status: "New",
        source: "Website",
        followUpLevel: 1,
        tags: {
          course: "CA Final",
          subject: "Accounts",
          term: "May 2025",
          faculty: "Bhanwar Borana",
          custom: ["Scholarship"],
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: "staff@example.com",
      },
      {
        id: "2",
        name: "Emily Johnson",
        phoneNumber: "+1 (555) 234-5678",
        email: "emily.johnson@example.com",
        query: "Information about CA Inter program",
        status: "In Progress",
        source: "Referral",
        followUpLevel: 2,
        tags: {
          course: "CA Inter",
          subject: "Law",
          term: "Nov 2025",
          faculty: "Parveen Sharma",
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updatedAt: new Date().toISOString(),
        assignedTo: "staff@example.com",
      },
      {
        id: "3",
        name: "Michael Brown",
        phoneNumber: "+1 (555) 345-6789",
        email: "michael.brown@example.com",
        query: "Pricing for CA Foundation course",
        status: "Closed",
        source: "Social Media",
        followUpLevel: 4,
        tags: {
          course: "CA Foundation",
          term: "May 2025",
        },
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updatedAt: new Date().toISOString(),
        assignedTo: "staff@example.com",
      },
      {
        id: "4",
        name: "Sarah Davis",
        phoneNumber: "+1 (555) 456-7890",
        email: "sarah.davis@example.com",
        query: "Application deadline for CA Final",
        status: "Sold",
        source: "Email Campaign",
        followUpLevel: 3,
        tags: {
          course: "CA Final",
          subject: "Taxation",
          term: "Nov 2025",
          custom: ["Urgent"],
        },
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        updatedAt: new Date().toISOString(),
        assignedTo: "staff@example.com",
      },
      {
        id: "5",
        name: "David Wilson",
        phoneNumber: "+1 (555) 567-8901",
        email: "david.wilson@example.com",
        query: "Scholarship opportunities for CA Inter",
        status: "New",
        source: "Phone Inquiry",
        followUpLevel: 1,
        tags: {
          course: "CA Inter",
          subject: "Accounts",
          term: "May 2026",
          custom: ["Scholarship"],
        },
        createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        updatedAt: new Date().toISOString(),
        assignedTo: "staff@example.com",
      },
    ]

    // Sample interactions
    const interactions: Interaction[] = [
      {
        id: "1",
        customerId: "1",
        notes: "Initial inquiry about CA Final course. Customer is interested in the curriculum and pricing.",
        status: "New",
        followUpLevel: 1,
        createdAt: new Date().toISOString(),
        createdBy: "staff@example.com",
      },
      {
        id: "2",
        customerId: "2",
        notes:
          "Followed up with course details and pricing information. Customer requested more information about faculty.",
        status: "In Progress",
        followUpLevel: 2,
        createdAt: new Date().toISOString(),
        createdBy: "staff@example.com",
      },
      {
        id: "3",
        customerId: "3",
        notes: "Customer decided not to enroll this term. Will follow up next term.",
        status: "Closed",
        followUpLevel: 4,
        createdAt: new Date().toISOString(),
        createdBy: "staff@example.com",
      },
      {
        id: "4",
        customerId: "4",
        notes: "Customer purchased CA Final complete course package.",
        status: "Sold",
        followUpLevel: 3,
        createdAt: new Date().toISOString(),
        createdBy: "staff@example.com",
      },
    ]

    // Sample tasks
    const tasks: Task[] = [
      {
        id: "1",
        customerId: "1",
        customerName: "John Smith",
        query: "Interested in CA Final course",
        deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        priority: "High",
        status: "Pending",
        assignedTo: "staff@example.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        customerId: "2",
        customerName: "Emily Johnson",
        query: "Information about CA Inter program",
        deadline: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
        priority: "Medium",
        status: "Pending",
        assignedTo: "staff@example.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        customerId: "5",
        customerName: "David Wilson",
        query: "Scholarship opportunities for CA Inter",
        deadline: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        priority: "Low",
        status: "Pending",
        assignedTo: "staff@example.com",
        createdAt: new Date().toISOString(),
      },
    ]

    // Save to localStorage
    localStorage.setItem("sources", JSON.stringify(sources))
    localStorage.setItem("tags", JSON.stringify(tags))
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("customers", JSON.stringify(customers))
    localStorage.setItem("interactions", JSON.stringify(interactions))
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }
}

// Get all customers
export function getCustomers(): Customer[] {
  const customers = localStorage.getItem("customers")
  return customers ? JSON.parse(customers) : []
}

// Get customer by ID
export function getCustomerById(id: string): Customer | null {
  const customers = getCustomers()
  return customers.find((customer) => customer.id === id) || null
}

// Add new customer
export function addCustomer(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Customer {
  const customers = getCustomers()

  // Check for duplicates
  const isDuplicatePhone = customers.some((c) => c.phoneNumber === customer.phoneNumber)
  const isDuplicateEmail = customers.some((c) => c.email === customer.email)

  if (isDuplicatePhone || isDuplicateEmail) {
    throw new Error("Customer with this phone number or email already exists")
  }

  const newCustomer: Customer = {
    ...customer,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  customers.push(newCustomer)
  localStorage.setItem("customers", JSON.stringify(customers))

  return newCustomer
}

// Update customer
export function updateCustomer(id: string, updates: Partial<Customer>): Customer {
  const customers = getCustomers()
  const index = customers.findIndex((customer) => customer.id === id)

  if (index === -1) {
    throw new Error("Customer not found")
  }

  const updatedCustomer = {
    ...customers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  customers[index] = updatedCustomer
  localStorage.setItem("customers", JSON.stringify(customers))

  return updatedCustomer
}

// Delete customer
export function deleteCustomer(id: string): void {
  const customers = getCustomers()
  const filteredCustomers = customers.filter((customer) => customer.id !== id)
  localStorage.setItem("customers", JSON.stringify(filteredCustomers))

  // Also delete related interactions and tasks
  const interactions = getInteractions()
  const filteredInteractions = interactions.filter((interaction) => interaction.customerId !== id)
  localStorage.setItem("interactions", JSON.stringify(filteredInteractions))

  const tasks = getTasks()
  const filteredTasks = tasks.filter((task) => task.customerId !== id)
  localStorage.setItem("tasks", JSON.stringify(filteredTasks))
}

// Get all interactions
export function getInteractions(): Interaction[] {
  const interactions = localStorage.getItem("interactions")
  return interactions ? JSON.parse(interactions) : []
}

// Get interactions by customer ID
export function getInteractionsByCustomerId(customerId: string): Interaction[] {
  const interactions = getInteractions()
  return interactions.filter((interaction) => interaction.customerId === customerId)
}

// Add new interaction
export function addInteraction(interaction: Omit<Interaction, "id" | "createdAt">): Interaction {
  const interactions = getInteractions()

  const newInteraction: Interaction = {
    ...interaction,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  interactions.push(newInteraction)
  localStorage.setItem("interactions", JSON.stringify(interactions))

  // Update customer status and follow-up level
  updateCustomer(interaction.customerId, {
    status: interaction.status,
    followUpLevel: interaction.followUpLevel,
  })

  return newInteraction
}

// Get all tasks
export function getTasks(): Task[] {
  const tasks = localStorage.getItem("tasks")
  return tasks ? JSON.parse(tasks) : []
}

// Get tasks by assigned user
export function getTasksByUser(email: string): Task[] {
  const tasks = getTasks()
  return tasks.filter((task) => task.assignedTo === email)
}

// Add new task
export function addTask(task: Omit<Task, "id" | "createdAt">): Task {
  const tasks = getTasks()

  const newTask: Task = {
    ...task,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  tasks.push(newTask)
  localStorage.setItem("tasks", JSON.stringify(tasks))

  return newTask
}

// Update task
export function updateTask(id: string, updates: Partial<Task>): Task {
  const tasks = getTasks()
  const index = tasks.findIndex((task) => task.id === id)

  if (index === -1) {
    throw new Error("Task not found")
  }

  const updatedTask = {
    ...tasks[index],
    ...updates,
  }

  tasks[index] = updatedTask
  localStorage.setItem("tasks", JSON.stringify(tasks))

  return updatedTask
}

// Get all sources
export function getSources(): Source[] {
  const sources = localStorage.getItem("sources")
  return sources ? JSON.parse(sources) : []
}

// Add new source
export function addSource(name: string): Source {
  const sources = getSources()

  const newSource: Source = {
    id: Date.now().toString(),
    name,
  }

  sources.push(newSource)
  localStorage.setItem("sources", JSON.stringify(sources))

  return newSource
}

// Update source
export function updateSource(id: string, name: string): Source {
  const sources = getSources()
  const index = sources.findIndex((source) => source.id === id)

  if (index === -1) {
    throw new Error("Source not found")
  }

  sources[index].name = name
  localStorage.setItem("sources", JSON.stringify(sources))

  return sources[index]
}

// Delete source
export function deleteSource(id: string): void {
  const sources = getSources()
  const filteredSources = sources.filter((source) => source.id !== id)
  localStorage.setItem("sources", JSON.stringify(filteredSources))
}

// Get all tags
export function getTags(): Tag[] {
  const tags = localStorage.getItem("tags")
  return tags ? JSON.parse(tags) : []
}

// Get tags by type
export function getTagsByType(type: Tag["type"]): Tag[] {
  const tags = getTags()
  return tags.filter((tag) => tag.type === type)
}

// Get dependent tags (e.g., subjects for a course)
export function getDependentTags(parentId: string): Tag[] {
  const tags = getTags()
  return tags.filter((tag) => tag.parentId === parentId)
}

// Add new tag
export function addTag(tag: Omit<Tag, "id">): Tag {
  const tags = getTags()

  const newTag: Tag = {
    ...tag,
    id: Date.now().toString(),
  }

  tags.push(newTag)
  localStorage.setItem("tags", JSON.stringify(tags))

  return newTag
}

// Update tag
export function updateTag(id: string, updates: Partial<Omit<Tag, "id">>): Tag {
  const tags = getTags()
  const index = tags.findIndex((tag) => tag.id === id)

  if (index === -1) {
    throw new Error("Tag not found")
  }

  tags[index] = {
    ...tags[index],
    ...updates,
  }

  localStorage.setItem("tags", JSON.stringify(tags))

  return tags[index]
}

// Delete tag
export function deleteTag(id: string): void {
  const tags = getTags()
  const filteredTags = tags.filter((tag) => tag.id !== id)
  localStorage.setItem("tags", JSON.stringify(filteredTags))

  // Also remove any dependent tags
  const dependentTags = filteredTags.filter((tag) => tag.parentId === id)
  if (dependentTags.length > 0) {
    const remainingTags = filteredTags.filter((tag) => tag.parentId !== id)
    localStorage.setItem("tags", JSON.stringify(remainingTags))
  }
}

// Get all users
export function getUsers(): User[] {
  const users = localStorage.getItem("users")
  return users ? JSON.parse(users) : []
}

// Add new user
export function addUser(user: Omit<User, "id" | "createdAt">): User {
  const users = getUsers()

  // Check for duplicate email
  const isDuplicateEmail = users.some((u) => u.email === user.email)
  if (isDuplicateEmail) {
    throw new Error("User with this email already exists")
  }

  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))

  return newUser
}

// Update user
export function updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt">>): User {
  const users = getUsers()
  const index = users.findIndex((user) => user.id === id)

  if (index === -1) {
    throw new Error("User not found")
  }

  users[index] = {
    ...users[index],
    ...updates,
  }

  localStorage.setItem("users", JSON.stringify(users))

  return users[index]
}

// Delete user
export function deleteUser(id: string): void {
  const users = getUsers()
  const filteredUsers = users.filter((user) => user.id !== id)
  localStorage.setItem("users", JSON.stringify(filteredUsers))
}

// Get dashboard stats
export function getDashboardStats(userEmail: string) {
  const customers = getCustomers()
  const tasks = getTasks()

  // Filter customers assigned to the current user
  const userCustomers = customers.filter((customer) => customer.assignedTo === userEmail)

  // Count by status
  const assignedCalls = userCustomers.filter((customer) => customer.status === "New").length
  const pendingCalls = userCustomers.filter((customer) => customer.status === "In Progress").length
  const completedCalls = userCustomers.filter(
    (customer) => customer.status === "Closed" || customer.status === "Sold",
  ).length

  // Count by follow-up level
  const firstOrder = userCustomers.filter((customer) => customer.followUpLevel === 1).length
  const secondOrder = userCustomers.filter((customer) => customer.followUpLevel === 2).length
  const thirdOrder = userCustomers.filter((customer) => customer.followUpLevel === 3).length
  const fourthOrder = userCustomers.filter((customer) => customer.followUpLevel === 4).length

  // Get pending tasks
  const pendingTasks = tasks.filter((task) => task.assignedTo === userEmail && task.status === "Pending")

  return {
    kpiData: {
      assignedCalls,
      pendingCalls,
      completedCalls,
      totalCalls: userCustomers.length,
    },
    tabData: [
      { id: "first-order", label: "First Order", count: firstOrder },
      { id: "second-order", label: "Second Order", count: secondOrder },
      { id: "third-order", label: "Third Order", count: thirdOrder },
      { id: "fourth-order", label: "Fourth Order", count: fourthOrder },
    ],
    pendingTasks,
  }
}

// Get chart data
export function getChartData(timeframe: "week" | "month" | "all") {
  const customers = getCustomers()

  // Get date ranges
  const now = new Date()
  let startDate: Date

  if (timeframe === "week") {
    // Last 7 days
    startDate = new Date(now)
    startDate.setDate(now.getDate() - 7)
  } else if (timeframe === "month") {
    // Last 30 days
    startDate = new Date(now)
    startDate.setDate(now.getDate() - 30)
  } else {
    // All time - use the earliest customer date
    const dates = customers.map((c) => new Date(c.createdAt).getTime())
    startDate = new Date(Math.min(...dates))
  }

  // Group customers by date
  const dateGroups = new Map<string, number>()

  customers.forEach((customer) => {
    const createdAt = new Date(customer.createdAt)

    // Skip if before start date
    if (createdAt < startDate) {
      return
    }

    // Format date based on timeframe
    let dateKey: string

    if (timeframe === "week") {
      // Use day name (Mon, Tue, etc.)
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      dateKey = days[createdAt.getDay()]
    } else if (timeframe === "month") {
      // Use date (1, 2, ..., 30)
      dateKey = createdAt.getDate().toString()
    } else {
      // Use month (Jan, Feb, etc.)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      dateKey = months[createdAt.getMonth()]
    }

    // Increment count for this date
    dateGroups.set(dateKey, (dateGroups.get(dateKey) || 0) + 1)
  })

  // Convert to chart data format
  let chartData: { name: string; calls: number }[] = []

  if (timeframe === "week") {
    // Ensure all days of the week are included
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    chartData = days.map((day) => ({
      name: day,
      calls: dateGroups.get(day) || 0,
    }))
  } else if (timeframe === "month") {
    // Sort by date
    chartData = Array.from(dateGroups.entries())
      .map(([date, count]) => ({ name: date, calls: count }))
      .sort((a, b) => Number.parseInt(a.name) - Number.parseInt(b.name))
  } else {
    // Sort by month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    chartData = months
      .filter((month) => dateGroups.has(month))
      .map((month) => ({
        name: month,
        calls: dateGroups.get(month) || 0,
      }))
  }

  return chartData
}

// Bulk import customers
export function bulkImportCustomers(customers: Omit<Customer, "id" | "createdAt" | "updatedAt">[]): {
  success: Customer[]
  errors: { data: Omit<Customer, "id" | "createdAt" | "updatedAt">; error: string }[]
} {
  const existingCustomers = getCustomers()
  const result = {
    success: [] as Customer[],
    errors: [] as { data: Omit<Customer, "id" | "createdAt" | "updatedAt">; error: string }[],
  }

  customers.forEach((customer) => {
    try {
      // Check for duplicates
      const isDuplicatePhone = existingCustomers.some((c) => c.phoneNumber === customer.phoneNumber)
      const isDuplicateEmail = existingCustomers.some((c) => c.email === customer.email)

      if (isDuplicatePhone) {
        throw new Error("Customer with this phone number already exists")
      }

      if (isDuplicateEmail) {
        throw new Error("Customer with this email already exists")
      }

      // Validate required fields
      if (!customer.name || !customer.phoneNumber || !customer.email || !customer.query) {
        throw new Error("Missing required fields")
      }

      // Create new customer
      const newCustomer: Customer = {
        ...customer,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      existingCustomers.push(newCustomer)
      result.success.push(newCustomer)
    } catch (error) {
      result.errors.push({
        data: customer,
        error: error.message,
      })
    }
  })

  // Save updated customers
  if (result.success.length > 0) {
    localStorage.setItem("customers", JSON.stringify(existingCustomers))
  }

  return result
}

// Export customers to CSV
export function exportCustomersToCSV(filters?: {
  status?: Customer["status"]
  followUpLevel?: Customer["followUpLevel"]
  tags?: Partial<Customer["tags"]>
}): string {
  let customers = getCustomers()

  // Apply filters
  if (filters) {
    if (filters.status) {
      customers = customers.filter((c) => c.status === filters.status)
    }

    if (filters.followUpLevel) {
      customers = customers.filter((c) => c.followUpLevel === filters.followUpLevel)
    }

    if (filters.tags) {
      customers = customers.filter((c) => {
        let match = true

        if (filters.tags.course) {
          match = match && c.tags.course === filters.tags.course
        }

        if (filters.tags.subject) {
          match = match && c.tags.subject === filters.tags.subject
        }

        if (filters.tags.term) {
          match = match && c.tags.term === filters.tags.term
        }

        if (filters.tags.faculty) {
          match = match && c.tags.faculty === filters.tags.faculty
        }

        return match
      })
    }
  }

  // Create CSV header
  const headers = [
    "ID",
    "Name",
    "Phone Number",
    "Email",
    "Query",
    "Status",
    "Source",
    "Follow-Up Level",
    "Course",
    "Subject",
    "Term",
    "Faculty",
    "Custom Tags",
    "Created At",
    "Updated At",
    "Assigned To",
  ]

  // Create CSV rows
  const rows = customers.map((c) => [
    c.id,
    c.name,
    c.phoneNumber,
    c.email,
    c.query,
    c.status,
    c.source,
    c.followUpLevel,
    c.tags.course || "",
    c.tags.subject || "",
    c.tags.term || "",
    c.tags.faculty || "",
    c.tags.custom ? c.tags.custom.join(", ") : "",
    new Date(c.createdAt).toLocaleDateString(),
    new Date(c.updatedAt).toLocaleDateString(),
    c.assignedTo || "",
  ])

  // Combine header and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  return csvContent
}

