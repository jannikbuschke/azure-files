using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using Xunit;

namespace AzFiles.Test
{
    public class ApiShould
    {
        // public ApiShould(CustomWebApplicationFactory factory) : base(factory) { }

        [Fact(Timeout = 6000)]
        public async void Not_Throw()
        {
            var options = new BoundedChannelOptions(100) { FullMode = BoundedChannelFullMode.Wait };

            var channel = Channel.CreateBounded<string>(options);

            var x1 =  Task.Run(async () =>
            {
                await Task.Delay(5000);
                channel.Writer.TryWrite("item1");
            });

            var x2 = Task.Run(async () =>
            {
                await Task.Delay(50);

                var result = await channel.Reader.ReadAsync();
                Assert.Equal("item1", result);
            });

            await Task.WhenAll(x1, x2);
            // HttpResponseMessage response = await client.GetAsync("/hello");
            // response.EnsureSuccessStatusCode();
            // var content = await response.Content.ReadAsStringAsync();
            // Assert.Equal("hello world", content);
        }
    }
}
