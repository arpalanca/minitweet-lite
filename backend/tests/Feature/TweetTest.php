<?php

namespace Tests\Feature;

use App\Models\Tweet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TweetTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_create_tweet(): void
    {
        $response = $this->postJson('/api/tweets', ['body' => 'Hello']);
        $response->assertStatus(401);
    }

    public function test_user_can_create_tweet_within_limit(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/api/tweets', ['body' => str_repeat('a', 280)]);
        $response->assertCreated();
        $this->assertDatabaseCount('tweets', 1);
    }

    public function test_body_cannot_exceed_280_characters(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/api/tweets', ['body' => str_repeat('a', 281)]);
        $response->assertStatus(422);
    }

    public function test_user_can_like_and_unlike_tweet(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $tweet = Tweet::factory()->for($user)->create();

        $like = $this->postJson("/api/tweets/{$tweet->id}/like");
        $like->assertOk();
        $this->assertDatabaseHas('likes', [
            'user_id' => $user->id,
            'tweet_id' => $tweet->id,
        ]);

        $unlike = $this->deleteJson("/api/tweets/{$tweet->id}/like");
        $unlike->assertOk();
        $this->assertDatabaseMissing('likes', [
            'user_id' => $user->id,
            'tweet_id' => $tweet->id,
        ]);
    }
}


