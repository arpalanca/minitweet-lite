<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTweetRequest;
use App\Models\Tweet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TweetController extends Controller
{
	public function index(Request $request): JsonResponse
	{
		$tweets = Tweet::query()
			->with(['user:id,name,email', 'likedBy:id'])
			->latest()
			->paginate(20);

		return response()->json([
			'data' => $tweets->items(),
			'current_page' => $tweets->currentPage(),
			'next_page_url' => $tweets->nextPageUrl(),
		]);
	}

	public function store(StoreTweetRequest $request): JsonResponse
	{
		$tweet = Tweet::create([
			'user_id' => $request->user()->id,
			'body' => $request->string('body'),
		]);

		$tweet->load(['user:id,name,email', 'likedBy:id']);

		return response()->json($tweet, 201);
	}

	public function like(Request $request, Tweet $tweet): JsonResponse
	{
		$tweet->likedBy()->syncWithoutDetaching([$request->user()->id]);
		return response()->json(['liked' => true, 'likes_count' => $tweet->likedBy()->count()]);
	}

	public function unlike(Request $request, Tweet $tweet): JsonResponse
	{
		$tweet->likedBy()->detach($request->user()->id);
		return response()->json(['liked' => false, 'likes_count' => $tweet->likedBy()->count()]);
	}
}


