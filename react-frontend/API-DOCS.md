# Create4Me API Documentation

This documentation covers all the backend APIs and Edge Functions available for the Create4Me platform.

## Table of Contents

1. [Authentication](#authentication)
2. [Database Tables](#database-tables)
3. [Edge Functions](#edge-functions)
4. [Real-time Subscriptions](#real-time-subscriptions)
5. [Storage](#storage)
6. [Examples](#examples)

## Authentication

Create4Me uses Supabase Auth for user authentication.

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      full_name: 'John Doe',
      avatar_url: 'https://example.com/avatar.jpg'
    }
  }
})
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### OAuth Providers
```typescript
// Google
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'http://localhost:3000/auth/callback'
  }
})

// GitHub
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: 'http://localhost:3000/auth/callback'
  }
})
```

## Database Tables

### Core Tables

#### profiles
User profiles are automatically created when users sign up.

```typescript
interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  timezone?: string
  preferences: Record<string, any>
  subscription_plan: string
  trial_ends_at?: string
  created_at: string
  updated_at: string
}

// Get current user profile
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()

// Update profile
const { error } = await supabase
  .from('profiles')
  .update({ full_name: 'New Name' })
  .eq('id', user.id)
```

#### teams
Teams allow collaboration between users.

```typescript
interface Team {
  id: string
  name: string
  slug: string
  description?: string
  owner_id: string
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

// Get user's teams
const { data: teams } = await supabase
  .from('teams')
  .select(`
    *,
    team_members!inner(role),
    profiles!owner_id(full_name, avatar_url)
  `)

// Create team
const { data: team } = await supabase
  .from('teams')
  .insert({
    name: 'My Team',
    slug: 'my-team',
    description: 'Team description'
  })
  .select()
  .single()
```

#### projects
Projects contain tasks, content, and landing pages.

```typescript
interface Project {
  id: string
  name: string
  slug: string
  description?: string
  team_id: string
  owner_id: string
  status: 'active' | 'archived' | 'completed'
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

// Get team projects
const { data: projects } = await supabase
  .from('projects')
  .select(`
    *,
    teams(name),
    profiles!owner_id(full_name, avatar_url)
  `)
  .eq('team_id', teamId)

// Create project
const { data: project } = await supabase
  .from('projects')
  .insert({
    name: 'New Project',
    slug: 'new-project',
    team_id: teamId,
    description: 'Project description'
  })
  .select()
  .single()
```

#### tasks
Task management with Kanban boards.

```typescript
interface Task {
  id: string
  title: string
  description?: string
  project_id: string
  column_id: string
  created_by: string
  assigned_to?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'todo' | 'in_progress' | 'done'
  due_date?: string
  labels: string[]
  position: number
  created_at: string
  updated_at: string
}

// Get project tasks
const { data: tasks } = await supabase
  .from('tasks')
  .select(`
    *,
    task_columns(name, color),
    profiles!created_by(full_name, avatar_url),
    profiles!assigned_to(full_name, avatar_url)
  `)
  .eq('project_id', projectId)
  .order('position')

// Create task
const { data: task } = await supabase
  .from('tasks')
  .insert({
    title: 'New Task',
    description: 'Task description',
    project_id: projectId,
    column_id: columnId,
    priority: 'medium'
  })
  .select()
  .single()

// Update task position (drag & drop)
const { error } = await supabase
  .from('tasks')
  .update({ 
    column_id: newColumnId, 
    position: newPosition 
  })
  .eq('id', taskId)
```

#### content
Content management for blogs, social media, etc.

```typescript
interface Content {
  id: string
  title: string
  content: string
  excerpt?: string
  type: 'blog_post' | 'social_post' | 'email' | 'tweet' | 'page' | 'other'
  status: 'draft' | 'published' | 'scheduled' | 'archived'
  project_id: string
  created_by: string
  scheduled_for?: string
  seo_title?: string
  seo_description?: string
  featured_image?: string
  tags: string[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

// Get project content
const { data: content } = await supabase
  .from('content')
  .select(`
    *,
    profiles!created_by(full_name, avatar_url)
  `)
  .eq('project_id', projectId)
  .order('updated_at', { ascending: false })

// Create content
const { data: newContent } = await supabase
  .from('content')
  .insert({
    title: 'New Blog Post',
    content: 'Content here...',
    type: 'blog_post',
    project_id: projectId,
    status: 'draft'
  })
  .select()
  .single()
```

#### landing_pages
Landing page builder with components.

```typescript
interface LandingPage {
  id: string
  name: string
  slug: string
  title: string
  description?: string
  project_id: string
  created_by: string
  is_published: boolean
  components: Array<{
    type: string
    content: Record<string, any>
    styles?: Record<string, any>
  }>
  styles: Record<string, any>
  seo_settings: Record<string, any>
  custom_domain?: string
  created_at: string
  updated_at: string
}

// Get project landing pages
const { data: pages } = await supabase
  .from('landing_pages')
  .select(`
    *,
    profiles!created_by(full_name, avatar_url)
  `)
  .eq('project_id', projectId)

// Create landing page
const { data: page } = await supabase
  .from('landing_pages')
  .insert({
    name: 'New Landing Page',
    slug: 'new-page',
    title: 'Page Title',
    project_id: projectId,
    components: [
      {
        type: 'hero',
        content: {
          headline: 'Welcome',
          subheadline: 'Subtitle here'
        }
      }
    ]
  })
  .select()
  .single()
```

## Edge Functions

### AI Assistant (`/functions/v1/ai-assistant`)

Generate content using OpenAI.

```typescript
// Generate blog post
const response = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'generate',
    type: 'blog_post',
    prompt: 'Write about productivity tips for remote workers',
    options: {
      tone: 'professional',
      length: 'medium'
    }
  })
})

const { content, usage } = await response.json()

// Chat with AI
const response = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'chat',
    message: 'Help me write a social media post about my new product',
    context: {
      project_id: 'project-uuid',
      previous_messages: []
    }
  })
})

// Create tasks from content
const response = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'create_tasks',
    content: 'Launch new product: design landing page, write copy, set up analytics',
    project_id: 'project-uuid'
  })
})
```

### Analytics (`/functions/v1/analytics`)

Track events and page views.

```typescript
// Track page view
const response = await fetch(`${supabaseUrl}/functions/v1/analytics`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_type: 'page_view',
    page_id: 'landing-page-uuid',
    visitor_id: 'anonymous-visitor-id',
    metadata: {
      referrer: document.referrer,
      user_agent: navigator.userAgent
    }
  })
})

// Track form submission
const response = await fetch(`${supabaseUrl}/functions/v1/analytics`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event_type: 'form_submission',
    page_id: 'landing-page-uuid',
    form_data: {
      email: 'user@example.com',
      name: 'John Doe'
    }
  })
})

// Get analytics data
const response = await fetch(`${supabaseUrl}/functions/v1/analytics?` + new URLSearchParams({
  page_id: 'landing-page-uuid',
  start_date: '2024-01-01',
  end_date: '2024-01-31',
  metrics: 'page_views,conversions'
}), {
  headers: {
    'Authorization': `Bearer ${session.access_token}`
  }
})
```

### Send Campaign (`/functions/v1/send-campaign`)

Send email campaigns to subscribers.

```typescript
// Send campaign
const response = await fetch(`${supabaseUrl}/functions/v1/send-campaign`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    campaign_id: 'campaign-uuid'
  })
})

// Send test email
const response = await fetch(`${supabaseUrl}/functions/v1/send-campaign`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'send_test',
    campaign_id: 'campaign-uuid',
    test_email: 'test@example.com'
  })
})
```

### Notifications (`/functions/v1/notifications`)

Send notifications via email, push, or in-app.

```typescript
// Send notification
const response = await fetch(`${supabaseUrl}/functions/v1/notifications`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    user_id: 'user-uuid',
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: 'You have been assigned a new task: "Update landing page"',
    channels: ['email', 'push', 'in_app'],
    data: {
      task_id: 'task-uuid',
      project_id: 'project-uuid'
    }
  })
})
```

## Real-time Subscriptions

Subscribe to real-time updates using Supabase Realtime.

```typescript
// Subscribe to task updates
const tasksSubscription = supabase
  .channel('tasks-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'tasks',
      filter: `project_id=eq.${projectId}`
    },
    (payload) => {
      console.log('Task changed:', payload)
      // Update UI accordingly
    }
  )
  .subscribe()

// Subscribe to team member activity
const activitySubscription = supabase
  .channel('team-activity')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'activities',
      filter: `team_id=eq.${teamId}`
    },
    (payload) => {
      console.log('New activity:', payload.new)
      // Show activity notification
    }
  )
  .subscribe()

// Unsubscribe when component unmounts
tasksSubscription.unsubscribe()
```

## Storage

Upload and manage files.

```typescript
// Upload avatar
const file = event.target.files[0]
const fileExt = file.name.split('.').pop()
const fileName = `${user.id}-${Math.random()}.${fileExt}`
const filePath = `avatars/${fileName}`

const { data, error } = await supabase.storage
  .from('avatars')
  .upload(filePath, file)

if (!error) {
  // Update profile with new avatar URL
  const { data: publicURL } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)
  
  await supabase
    .from('profiles')
    .update({ avatar_url: publicURL.publicUrl })
    .eq('id', user.id)
}

// Upload content media
const { data, error } = await supabase.storage
  .from('content-media')
  .upload(`content/${contentId}/${fileName}`, file)

// Delete file
const { error } = await supabase.storage
  .from('avatars')
  .remove([filePath])
```

## Examples

### Complete Task Management Flow

```typescript
// 1. Get project with tasks and columns
const { data: project } = await supabase
  .from('projects')
  .select(`
    *,
    task_columns(*),
    tasks(
      *,
      profiles!created_by(full_name, avatar_url),
      profiles!assigned_to(full_name, avatar_url)
    )
  `)
  .eq('id', projectId)
  .single()

// 2. Create new task
const { data: newTask } = await supabase
  .from('tasks')
  .insert({
    title: 'New Feature Development',
    description: 'Implement user dashboard',
    project_id: projectId,
    column_id: todoColumnId,
    priority: 'high',
    due_date: '2024-01-15T10:00:00Z'
  })
  .select(`
    *,
    profiles!created_by(full_name, avatar_url)
  `)
  .single()

// 3. Move task to different column
const { error } = await supabase
  .from('tasks')
  .update({ 
    column_id: inProgressColumnId,
    status: 'in_progress'
  })
  .eq('id', taskId)

// 4. Assign task to team member
const { error } = await supabase
  .from('tasks')
  .update({ assigned_to: userId })
  .eq('id', taskId)
```

### Landing Page with Form Handling

```typescript
// 1. Create landing page
const { data: page } = await supabase
  .from('landing_pages')
  .insert({
    name: 'Product Launch',
    slug: 'product-launch',
    title: 'Amazing New Product',
    project_id: projectId,
    components: [
      {
        type: 'hero',
        content: {
          headline: 'Revolutionary Product',
          subheadline: 'Change the way you work',
          buttonText: 'Get Early Access',
          buttonUrl: '#signup'
        }
      },
      {
        type: 'form',
        content: {
          title: 'Join the Waitlist',
          fields: [
            { name: 'email', type: 'email', label: 'Email', required: true },
            { name: 'name', type: 'text', label: 'Name', required: true }
          ]
        }
      }
    ],
    is_published: true
  })
  .select()
  .single()

// 2. Handle form submission (via analytics endpoint)
const handleFormSubmit = async (formData) => {
  const response = await fetch(`${supabaseUrl}/functions/v1/analytics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'form_submission',
      page_id: page.id,
      form_data: formData
    })
  })
  
  if (response.ok) {
    // Show success message
    console.log('Successfully subscribed!')
  }
}
```

### Content Creation with AI

```typescript
// 1. Generate blog post idea
const ideaResponse = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'generate',
    type: 'blog_post',
    prompt: 'productivity tips for remote workers',
    options: { tone: 'professional', length: 'long' }
  })
})

const { content: blogContent } = await ideaResponse.json()

// 2. Save content as draft
const { data: savedContent } = await supabase
  .from('content')
  .insert({
    title: 'Productivity Tips for Remote Workers',
    content: blogContent,
    type: 'blog_post',
    status: 'draft',
    project_id: projectId,
    tags: ['productivity', 'remote-work']
  })
  .select()
  .single()

// 3. Generate social media posts from blog content
const socialResponse = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    action: 'generate',
    type: 'tweet',
    prompt: `Create a Twitter thread from this blog post: ${blogContent.substring(0, 500)}`,
    options: { platform: 'twitter' }
  })
})

const { content: tweetThread } = await socialResponse.json()
```

## Error Handling

Always handle errors appropriately:

```typescript
try {
  const { data, error } = await supabase
    .from('projects')
    .insert(projectData)
    .select()
    .single()
  
  if (error) {
    console.error('Database error:', error.message)
    // Handle specific error types
    if (error.code === '23505') {
      // Unique constraint violation
      throw new Error('A project with this name already exists')
    }
    throw error
  }
  
  return data
} catch (error) {
  console.error('Unexpected error:', error)
  throw error
}
```

This API documentation should help you integrate the Create4Me backend with your frontend applications. All endpoints include proper authentication and authorization, and the database includes comprehensive Row Level Security policies to ensure data isolation between teams and users.
