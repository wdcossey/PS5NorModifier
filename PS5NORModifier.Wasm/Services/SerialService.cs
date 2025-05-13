using System;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace PS5NORModifier.Wasm.Services;


public class SerialService
{
    private readonly IJSRuntime _jsRuntime;

    public SerialService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public enum ResponseCode
    {
        Success = 0,
        Failed = 1,
        Exception = 2,
    }

    public class Response
    {
        [JsonPropertyName("code")]
        public ResponseCode Code { get; init; }
        [JsonPropertyName("message")]
        public string? Message { get; init; }
    }

    public async ValueTask<Response> RequestPortAsync()
    {
        return await _jsRuntime.InvokeAsync<Response>("serialInterop.requestPort");
    }

    public async ValueTask<Response> OpenPortAsync(int baudRate)
    {
        Response result = await _jsRuntime.InvokeAsync<Response>("serialInterop.openPort", baudRate);
        return result;
    }

    public async ValueTask WriteAsync(string data)
    {
        await _jsRuntime.InvokeVoidAsync("serialInterop.write", data);
    }

    public async ValueTask<string> ReadAsync()
    {
        return await _jsRuntime.InvokeAsync<string>("serialInterop.read");
    }

    public async ValueTask CloseAsync()
    {
        await _jsRuntime.InvokeVoidAsync("serialInterop.close");
    }
}