using Microsoft.AspNetCore.Components;
using PS5NORModifier.Wasm.Services;

namespace PS5NORModifier.Wasm.Pages;

public partial class SerialTerminal : ComponentBase
{
    [Inject] private SerialService Serial { get; init; } = null!;
}