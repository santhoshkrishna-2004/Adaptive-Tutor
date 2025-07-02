interface MutedUser {
  userId: string
  userName: string
  mutedBy: string
  reason: string
  mutedAt: string
  mutedUntil?: string
  groupId: string
}

interface DeletedMessage {
  messageId: string
  deletedBy: string
  reason: string
  deletedAt: string
  groupId: string
}

interface FilterResult {
  filtered: string
  blocked: boolean
  warnings: string[]
}

interface SpamCheckResult {
  isSpam: boolean
  warning?: string
}

interface MuteStatus {
  muted: boolean
  mutedUser?: MutedUser
}

class ChatModerationService {
  private mutedUsers: MutedUser[] = []
  private deletedMessages: DeletedMessage[] = []
  private messageHistory: { [userId: string]: { timestamp: number; content: string }[] } = {}

  // Content filters
  private profanityPatterns = [/\b(damn|hell|crap|stupid|idiot)\b/gi, /\b(f[u*]+ck|sh[i*]+t|b[i*]+tch)\b/gi]

  private spamPatterns = [
    /(.)\1{4,}/g, // Repeated characters
    /[A-Z]{5,}/g, // Excessive caps
  ]

  filterMessage(content: string, groupId: string): FilterResult {
    let filtered = content
    const warnings: string[] = []
    let blocked = false

    // Check for profanity
    for (const pattern of this.profanityPatterns) {
      if (pattern.test(content)) {
        filtered = filtered.replace(pattern, (match) => "*".repeat(match.length))
        warnings.push("Message contains inappropriate language")
      }
    }

    // Check for spam patterns
    for (const pattern of this.spamPatterns) {
      if (pattern.test(content)) {
        warnings.push("Message appears to be spam")
        blocked = true
      }
    }

    // Check message length
    if (content.length > 500) {
      warnings.push("Message is too long (max 500 characters)")
      blocked = true
    }

    return { filtered, blocked, warnings }
  }

  checkSpamRate(userId: string, groupId: string): SpamCheckResult {
    const now = Date.now()
    const userHistory = this.messageHistory[userId] || []

    // Remove messages older than 1 minute
    const recentMessages = userHistory.filter((msg) => now - msg.timestamp < 60000)
    this.messageHistory[userId] = recentMessages

    // Check if user is sending too many messages
    if (recentMessages.length >= 10) {
      return {
        isSpam: true,
        warning: "You are sending messages too quickly. Please slow down.",
      }
    }

    // Add current timestamp
    recentMessages.push({ timestamp: now, content: "" })

    return { isSpam: false }
  }

  muteUser(
    userId: string,
    userName: string,
    mutedBy: string,
    reason: string,
    groupId: string,
    durationMinutes?: number,
  ): MutedUser {
    // Remove existing mute for this user in this group
    this.mutedUsers = this.mutedUsers.filter((mu) => !(mu.userId === userId && mu.groupId === groupId))

    const mutedUntil = durationMinutes ? new Date(Date.now() + durationMinutes * 60000).toISOString() : undefined

    const mutedUser: MutedUser = {
      userId,
      userName,
      mutedBy,
      reason,
      mutedAt: new Date().toISOString(),
      mutedUntil,
      groupId,
    }

    this.mutedUsers.push(mutedUser)
    return mutedUser
  }

  isUserMuted(userId: string, groupId: string): MuteStatus {
    const mutedUser = this.mutedUsers.find((mu) => mu.userId === userId && mu.groupId === groupId)

    if (!mutedUser) {
      return { muted: false }
    }

    // Check if temporary mute has expired
    if (mutedUser.mutedUntil && new Date(mutedUser.mutedUntil) < new Date()) {
      this.unmuteUser(userId, groupId)
      return { muted: false }
    }

    return { muted: true, mutedUser }
  }

  unmuteUser(userId: string, groupId: string): boolean {
    const initialLength = this.mutedUsers.length
    this.mutedUsers = this.mutedUsers.filter((mu) => !(mu.userId === userId && mu.groupId === groupId))
    return this.mutedUsers.length < initialLength
  }

  deleteMessage(messageId: string, deletedBy: string, reason: string, groupId: string): boolean {
    const deletedMessage: DeletedMessage = {
      messageId,
      deletedBy,
      reason,
      deletedAt: new Date().toISOString(),
      groupId,
    }

    this.deletedMessages.push(deletedMessage)
    return true
  }

  getMutedUsers(groupId: string): MutedUser[] {
    return this.mutedUsers.filter((mu) => mu.groupId === groupId)
  }

  getDeletedMessages(groupId: string): DeletedMessage[] {
    return this.deletedMessages.filter((dm) => dm.groupId === groupId)
  }
}

export const chatModerationService = new ChatModerationService()
